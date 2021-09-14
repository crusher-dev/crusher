/**
 * Copyright 2018 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 import WebSocket from 'ws';
 import { makeWaitForNextTask } from '../utils/utils';

 export type ProtocolRequest = {
   id: number;
   method: string;
   params: any;
   sessionId?: string;
 };

 export type ProtocolResponse = {
   id?: number;
   method?: string;
   sessionId?: string;
   error?: { message: string; data: any; };
   params?: any;
   result?: any;
   pageProxyId?: string;
   browserContextId?: string;
 };

 export interface ConnectionTransport {
   send(s: ProtocolRequest): void;
   close(): void;  // Note: calling close is expected to issue onclose at some point.
   onmessage?: (message: ProtocolResponse) => void,
   onclose?: () => void,
 }

 export class WebSocketTransport implements ConnectionTransport {
   private _ws: WebSocket;
   private _progress: Progress;

   onmessage?: (message: ProtocolResponse) => void;
   onclose?: () => void;
   readonly wsEndpoint: string;

   static async connect(progress: Progress, url: string, headers?: { [key: string]: string; }): Promise<WebSocketTransport> {
     progress.log(`<ws connecting> ${url}`);
     const transport = new WebSocketTransport(progress, url, headers);
     let success = false;
     progress.cleanupWhenAborted(async () => {
       if (!success)
         await transport.closeAndWait().catch(e => null);
     });
     await new Promise<WebSocketTransport>((fulfill, reject) => {
       transport._ws.addEventListener('open', async () => {
         progress.log(`<ws connected> ${url}`);
         fulfill(transport);
       });
       transport._ws.addEventListener('error', event => {
         progress.log(`<ws connect error> ${url} ${event.message}`);
         reject(new Error('WebSocket error: ' + event.message));
         transport._ws.close();
       });
     });
     success = true;
     return transport;
   }

   constructor(progress: Progress, url: string, headers?: { [key: string]: string; }) {
     this.wsEndpoint = url;
     this._ws = new WebSocket(url, [], {
       perMessageDeflate: false,
       maxPayload: 256 * 1024 * 1024, // 256Mb,
       handshakeTimeout: progress.timeUntilDeadline(),
       headers
     });
     this._progress = progress;
     // The 'ws' module in node sometimes sends us multiple messages in a single task.
     // In Web, all IO callbacks (e.g. WebSocket callbacks)
     // are dispatched into separate tasks, so there's no need
     // to do anything extra.
     const messageWrap: (cb: () => void) => void = makeWaitForNextTask();

     this._ws.addEventListener('message', event => {
       messageWrap(() => {
         try {
           if (this.onmessage)
             this.onmessage.call(null, JSON.parse(event.data));
         } catch (e) {
           this._ws.close();
         }
       });
     });

     this._ws.addEventListener('close', event => {
       this._progress && this._progress.log(`<ws disconnected> ${url}`);
       if (this.onclose)
         this.onclose.call(null);
     });
     // Prevent Error: read ECONNRESET.
     this._ws.addEventListener('error', () => {});
   }

   send(message: ProtocolRequest) {
     this._ws.send(JSON.stringify(message));
   }

   close() {
     this._progress && this._progress.log(`<ws disconnecting> ${this._ws.url}`);
     this._ws.close();
   }

   async closeAndWait() {
     const promise = new Promise(f => this._ws.once('close', f));
     this.close();
     await promise; // Make sure to await the actual disconnect.
   }
 }
