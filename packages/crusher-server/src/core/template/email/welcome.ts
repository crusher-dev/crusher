export const getWelcomEmailContent = (id) =>
	`
   <html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0;">
 <meta name="format-detection" content="telephone=no"/>

<style>
/* Reset styles */ 
body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
#outlook a { padding: 0; }
.ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }

/* Rounded corners for advanced mail clients only */ 
@media all and (min-width: 560px) {
.container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px; }
}

/* Set color for auto links (addresses, dates, etc.) */ 
a, a:hover {
color: #FFFFFF;
}
.footer a, .footer a:hover {
color: #828999;
}

 </style>

<!-- MESSAGE SUBJECT -->
<title>Responsive HTML email templates</title>

</head>

<!-- BODY -->
<!-- Set message background color (twice) and text color (twice) -->
<body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
"

>

<!-- SECTION / BACKGROUND -->
<!-- Set message background color one again -->
<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class=""><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
>

<!-- WRAPPER -->
<!-- Set wrapper width (twice) -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
width="500" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
max-width: 500px;" class="wrapper">

<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
padding-top: 20px;
padding-bottom: 0px;">


<!-- LOGO -->
<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->
<a target="_blank" style="text-decoration: none;"
href="https://crusher.dev"><img border="0" vspace="0" hspace="0"
src="https://res.cloudinary.com/dnanbuigy/image/fetch/c_scale,h_100/q_99/https://i.imgur.com/2SRsWRr.png"
width="200" height="60"
alt="Logo" title="Logo" style="    object-fit: contain;
color: #000000;
font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" /></a>

</td>
</tr>


<!-- SUPHEADER -->
<!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 14px; font-weight: 400; line-height: 100%; letter-spacing: 2px;
padding-top: 0px;
margin-top:10px;
padding-bottom: 40px;
color: #000000;
font-family: sans-serif;" class="supheader">
Making testing website easy and reliable
</td>
</tr>

<!-- HERO IMAGE -->
<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
padding-top: 0px;" class="hero"><img border="0" vspace="0" hspace="0"
src="https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif"
alt="Please enable images to view this content" title="Hero Image"
width="320" style="
border-radius: 5px;
width: 100%;
max-width: 380px;
color: #FFFFFF; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></td>
</tr>



<!-- HEADER -->
<!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  ; padding-right: 6.25%; width: 87.5%; font-size: 16px; font-weight: bold; line-height: 130%;
padding-top: 20px;
color: #000000;
font-family: sans-serif; padding-left: 11.75%; text-align: left;" class="header">
Welcome Onboard!!
</td>
</tr>


<!-- PARAGRAPH -->
<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  padding-left: 11.75%; text-align: left;padding-right: 6.25%; width: 87.5%; font-size: 16px; font-weight: 400; line-height: 160%;
padding-top: 15px; 
                                     
color: #000000;
font-family: sans-serif;" class="paragraph">
  We're pumped and excited to have you😃.<br></br> We've built this platform to solve our own need to test software without putting much effort.<br/>
We're constantly looking for feedback/suggestion, feedback/suggestion are appreciated. 
</td>
</tr>

<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  padding-left: 11.75%; text-align: left;padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
padding-top: 15px; 
color: #000000;
font-family: sans-serif;" class="paragraph">
- Himanshu 👨‍️, himanshu@crusher.dev
</td>
</tr>

<!-- BUTTON -->
<!-- Set button background color at TD, link/text color at A and TD, font family ("sans-serif" or "Georgia, serif") at TD. For verification codes add "letter-spacing: 5px;". Link format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Button-Name}}&utm_campaign={{Campaign-Name}} -->
<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
padding-top: 25px;
padding-bottom: 5px;" class="button"><a
href="${id}" target="_blank" style="text-decoration: underline;">
<table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
bgcolor="#f8598b"><a target="_blank" style="text-decoration: underline;
color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;"
>
Verify my account
</a>
</td></tr></table></a>
</td>
</tr>

<!-- LINE -->
<!-- Set line color -->
<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
padding-top: 30px;" class="line"><hr
color="#565F73" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
</td>
</tr>

<!-- FOOTER -->
<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
<tr>
<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
padding-top: 10px;
padding-bottom: 20px;
color: #828999;
font-family: sans-serif;" class="footer">

Please ignore if this wasn't intended for you :/.


</td>
</tr>

<!-- End of WRAPPER -->
</table>
<!-- End of SECTION / BACKGROUND -->
</td></tr></table>

</body>
</html>
   `;
