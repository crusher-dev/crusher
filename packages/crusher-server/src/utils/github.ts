import { GithubService } from "@modules/thirdParty/github/service";
import { extractOwnerAndRepoName } from "@utils/helper";
import { Logger } from "@utils/logger";

export function getGithubToken() {
	const appId = 70466;
	const privateKey =
		"-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEApjY24VXBk0/Ow3LNos1uS+svnn4nmjcTlVOQNJVeFlCNpNLXFcGloboTq1loSd3WpxIsal/W4ZtWB7K/CJNZghH1+6sIy7xsoL5KCl5RU+/JOzpwo/0xidlqiccloAAcuEb/1r9+ZWZQDx/bmMs5+D8YZGe+3H8tM+ok4+d//08O7GF+kQA3av2uHHOBqbAqYfoh7E9tfaTAhxnhvABZnE5YhCaqAqMQoxjVK833rWnAm39E0f6/Fuj1cAm7KOChb0y6Y8R5hQqzt/j52N9ivWsCc5GyDKtQg6r609PrByLFI+L7x2Q9HrErENHQNEW/PvLBqMNOkjElLbwR+468CwIDAQABAoIBAQCchMMrcUknwujPbsWswM1T2rZuBxieBa2AWj+a9Om0E8k+5Hk8+K1T3dl162zk2m2vyNJgnb3JmDDscOuqVK/eZ7F/fDF9QgP9XxR0LRti8pRKHR9DnkPPLxk/g3Sv9ksVUW7MuGl7bVyI0ZRGj2IYnroGmxfFplFX6O8yWqdTMIgPqERsgTjl5txBc2v9ycY+sTG8s9E3zwWcXMGNfajBglMFmb4iQ1H11MmdqAiPvYaNfi8dij2C/naqbpuc5Yz98yFjzY6pYSP2KGX56+Zfw/38P1W/b0MpPxSESh0gSewYBzIhNam9t3RByHf/IUNfo7eoD35KJUlEwxPa+Xc5AoGBANRhrxwP0MMAuvg1AfqJpMHIUwZHTh15BhQC9PnPGCIySOvl+F08/KB7GS6IZrFPm616fhZA86VvmjFWlUxes2WdC7jGu7TQV9mK1i1nQqsZb5Hsba0Y+zCpX8wIzY11j1RJrrRF84Hb6UntJBUiA+ZIlfCuSW4BfTBrBEdV6NBnAoGBAMhZE2zTd/MNSkv6Fhwz74iBZaHxoXRXIgFRf5zhkLg1Mu5O/Y6ByhxgXkNaB3T99FgIbq9g8MWh/4r45B7EQ9U+uNsfm73vuQgQxQ0No6sYDHTDGaQMkXi9gC8ddirisAx24pLTPNOWgEZqDFMvDnAhyNTlKItAtWbttziCYCC9AoGBAMD+/+TtTlVWfZF+ggzNNiZOx3vGImtQBkD7Kukz04eH0JJmChuYhy3Cj3CkzUVFxX+Q97F7Vq24zBMXzlZ3HGkznGpOVlcKmTp8GwNpecEIPUYK5uPM9r8Su5YrTbfF4/jBeHwjsRQJ5mailA6MOaTzwyXTC7Fmsv/j0CCPJiDzAoGBAJOyZ0mhFBqQP6eHNGmSOBIQIpaihX45Bg6mwEctWv0R6vwYK4C1WgRVXuiUJE8xMML9ZGvSMW3hIXyYQ8QSuFcqqCiSQsRhR60Uf9BBr9jgH76sXei8gznZqfgR5h1zhImL0zielYb+uo4ue+uPEzvDDEU2sw8FozXAJYR5SNiZAoGAXq/AKYYSdzULuznjcIrB14a8DamBUbiXTFEAYsRyKjVFNFzJ9/D33r+u/appMbjh6UMaUfJGBid9pBFtil6V42T5pNWXnuBYyjrdGGc2h+vCnuC8dhIwH3qPUyBHfMBlcOGdVH/VZP8BHn8qjnJ/JMt5Cv/8r+5ylOE1HQc3RIc=\n-----END RSA PRIVATE KEY-----";
	const jsonwebtoken = require("jsonwebtoken");
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iat: now, // Issued at time
		exp: now + 60, // JWT expiration time
		iss: appId,
	};
	const bearer = jsonwebtoken.sign(payload, privateKey, { algorithm: "RS256" });

	return bearer;
}