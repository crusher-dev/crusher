import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, PaymentRequestButtonElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { css } from "@emotion/core";

// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
	style: {
		base: {
			color: "#32325d",
			fontFamily: '"Gilroy", Helvetica, sans-serif',
			fontSmoothing: "antialiased",
			fontSize: "16px",
			"::placeholder": {
				color: "#aab7c4",
			},
		},
		invalid: {
			color: "#fa755a",
			iconColor: "#fa755a",
		},
	},
};

const CheckoutForm = () => {
	const stripe = useStripe();
	const elements = useElements();

	const [error, setError] = useState(null);
	const [name, setName] = useState("");

	// Handle real-time validation errors from the card Element.
	const handleChange = (event) => {
		if (event.error) {
			setError(event.error.message);
		} else {
			setError(null);
		}
	};

	// Handle form submission.
	const handleSubmit = async (event) => {
		event.preventDefault();
		const card = elements.getElement(CardElement);
		const result = await stripe.createToken(card);
		if (result.error) {
			// Inform the user if there was an error.
			setError(result.error.message);
		} else {
			setError(null);
			// Send the token to your server.
			await stripeTokenHandler(result.token);
		}
	};

	const [paymentRequest, setPaymentRequest] = useState(null);

	useEffect(() => {
		if (stripe) {
			const pr = stripe.paymentRequest({
				country: "US",
				currency: "usd",
				total: {
					label: "Demo total",
					amount: 239,
				},
			});

			// Check the availability of the Payment Request API.
			pr.canMakePayment().then((result) => {
				if (result) {
					setPaymentRequest(pr);
				}
			});
		}
	}, [stripe]);

	return (
		<form onSubmit={handleSubmit} css={[!paymentRequest && noPayButton, stripeForm]}>
			{paymentRequest && (
				<>
					<div css={addCardOneClick}>Add card with one click</div>

					<div css={payNowButton}>
						<PaymentRequestButtonElement
							options={{
								paymentRequest,
								style: {
									paymentRequestButton: {
										height: "49px",
									},
								},
							}}
						/>
					</div>

					<div css={orText}>or</div>
				</>
			)}

			<label htmlFor="name" css={label}>
				Name
			</label>
			<div className="form-row">
				<input
					id="name"
					name="name"
					placeholder="Jenny Rosen"
					required
					css={nameElement}
					value={name}
					onChange={(event) => {
						setName(event.target.value);
					}}
				/>
			</div>

			<div className="form-row">
				<label htmlFor="card-element">Credit or debit card</label>
				<CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
				<div className="card-errors" role="alert" css={cardError}>
					{error}
				</div>
			</div>

			<button type="submit" css={submitButtonCss}>
				Add Credit card
			</button>
		</form>
	);
};

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

export const StripePaymentBox = () => {
	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm />
		</Elements>
	);
};

// POST the token ID to your backend.
async function stripeTokenHandler(token) {
	const response = await fetch("/charge", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token: token.id }),
	});

	return response.json();
}

const noPayButton = css`
	height: 22rem;
	margin-top: 3.5rem !important;
`;
const stripeForm = css`
	margin-top: 1.5rem;
`;

const payNowButton = css`
	margin-bottom: 1.5rem;
`;

const orText = css`
	text-align: center;
	color: grey;
`;

const addCardOneClick = css`
	margin-bottom: 1rem;
	text-align: center;
	font-size: 1rem;
	font-weight: 600;
`;

const submitButtonCss = css`
	background: #6583fe;
	padding: 1rem;
	width: 100%;
	text-align: center;
	font-family: Gilroy;
	font-weight: bold;
	color: #fff;
	font-size: 1.126rem;
	line-height: 1.126rem;
	cursor: pointer;
	font-weight: 700;
	border-radius: 0.31rem;
	margin-top: auto;
	margin-top: 1rem;
	background: #23232f;
`;

const nameElement = css`
	margin-top: 0.5rem;
	border: 1px solid #d0d0d0;
	width: 100%;
	height: 45px;
	box-shadow: 0 1px 3px 0 #e6ebf1;
	padding: 9px 18px;
	border-radius: 4px;
	font-size: 1rem;
	margin-bottom: 1.5rem;
`;

const cardError = css`
	height: 1.75rem;
	width: 100%;
`;

const label = css`
	display: block;
`;
