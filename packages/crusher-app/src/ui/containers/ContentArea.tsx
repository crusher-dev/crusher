export function ContentArea({ children } : any) {
	return (
		<div className="content content-container">
			<div className="container pd-x-0 pd-lg-x-10 pd-xl-x-0">{children}</div>
		</div>
	);
}
