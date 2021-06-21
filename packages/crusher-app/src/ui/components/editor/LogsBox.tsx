import { css } from "@emotion/core";
import { TestInstanceStatus } from "@interfaces/TestInstanceStatus";

export function LogsBox(props) {
	const { testInfo, style } = props;
	const { logs, status } = testInfo || { logs: [], status: TestInstanceStatus.QUEUED };

	const logsOut = logs
		? logs.map((log) => {
				return (
					<div css={styles.log} style={{ marginTop: 4 }}>
						{">"} {log.message}
					</div>
				);
		  })
		: [];
	return (
		<div css={styles.logsContainer} style={{ ...style, justifyContent: logs.length > 0 ? "left" : "center" }}>
			{logs && (
				<>
					{logs.length === 0 && status !== TestInstanceStatus.QUEUED && (
						<>
							<div css={styles.logsText}>Test Running</div>
							<span css={styles.logsText} style={{ marginTop: 4 }}>
								<img
									height={32}
									src={"/svg/tests/loading.svg"}
									style={{
										position: "relative",
										top: 2,
									}}
								/>
							</span>
						</>
					)}
					{logsOut}
				</>
			)}

			{/*{status === "COMPLETED" && (*/}
			{/*    <>*/}
			{/*        <span css={styles.logsText}>Test Finished running</span>*/}
			{/*        <div>*/}
			{/*            {testInfo && (<span>{JSON.stringify(testInfo.logs)}</span>)}*/}
			{/*        </div>*/}
			{/*    </>*/}
			{/*)}*/}
			{!testInfo && (
				<>
					<img src={"/svg/tests/sad.svg"} />
					<span css={styles.logsText}>Run this test to view logs</span>
				</>
			)}
		</div>
	);
}

const styles = {
	logsContainer: css`
		background: rgba(0, 0, 0, 0.05);
		border-radius: 0.25rem;
		width: 26rem;
		height: 14rem;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		overflow: scroll;
		padding-top: 2rem;
		padding: 1rem;
	`,
	logsText: css`
		margin-top: 1.15rem;
		color: #b6b6b6;
		font-size: 0.875rem;
	`,
	log: css`
		margin-top: 1.15rem;
		color: #32507c;
		font-size: 0.925rem;
		align-self: flex-start;
	`,
};
