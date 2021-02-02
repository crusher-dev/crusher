const THIRD_PARTY_API_KEYS = {
	SENDGRID: process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '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',
	LOGDNA: process.env.LOGDNA_API_KEY ? process.env.LOGDNA_API_KEY : 'c7bdd500e3cfbfe457a2ec4168b8cfaa',
	STRIPE: process.env.STRIPE_API_KEY
		? process.env.STRIPE_API_KEY
		: 'sk_test_51GpPlSJrl7auivTJtYVJyvBH1lsPnYHousGgR37uZvGo7EktiTRCAqZPlf0dicwkNEjRuXHYCzy6c5WMmX3x14rb00RWsMT0hy',
};

module.exports = {
	THIRD_PARTY_API_KEYS
};
