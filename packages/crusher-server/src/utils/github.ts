import { GithubService } from "@modules/thirdParty/github/service";
import { extractOwnerAndRepoName } from "@utils/helper";

export function getGithubToken() {
	const appId = 70466;
	const privateKey =
		"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCmNjbhVcGTT87D\ncs2izW5L6y+efieaNxOVU5A0lV4WUI2k0tcVwaWhuhOrWWhJ3danEixqX9bhm1YH\nsr8Ik1mCEfX7qwjLvGygvkoKXlFT78k7OnCj/TGJ2WqJxyWgABy4Rv/Wv35lZlAP\nH9uYyzn4PxhkZ77cfy0z6iTj53//Tw7sYX6RADdq/a4cc4GpsCph+iHsT219pMCH\nGeG8AFmcTliEJqoCoxCjGNUrzfetacCbf0TR/r8W6PVwCbso4KFvTLpjxHmFCrO3\n+PnY32K9awJzkbIMq1CDqvrT0+sHIsUj4vvHZD0esSsQ0dA0Rb8+8sGow06SMSUt\nvBH7jrwLAgMBAAECggEBAJyEwytxSSfC6M9uxazAzVPatm4HGJ4FrYBaP5r06bQT\nyT7keTz4rVPd2XXrbOTaba/I0mCdvcmYMOxw66pUr95nsX98MX1CA/1fFHQtG2Ly\nlEodH0OeQ88vGT+DdK/2SxVRbsy4aXttXIjRlEaPYhieugabF8WmUVfo7zJap1Mw\niA+oRGyBOOXm3EFza/3Jxj6xMbyz0TfPBZxcwY19qMGCUwWZviJDUfXUyZ2oCI+9\nho1+Lx2KPYL+dqpum5zljP3zIWPNjqlhI/YoZfnr5l/D/fw/Vb9vQyk/FIRKHSBJ\n7BgHMiE1qb23dEHId/8hQ1+jt6gPfkolSUTDE9r5dzkCgYEA1GGvHA/QwwC6+DUB\n+omkwchTBkdOHXkGFAL0+c8YIjJI6+X4XTz8oHsZLohmsU+brXp+FkDzpW+aMVaV\nTF6zZZ0LuMa7tNBX2YrWLWdCqxlvkextrRj7MKlfzAjNjXWPVEmutEXzgdvpSe0k\nFSID5kiV8K5JbgF9MGsER1Xo0GcCgYEAyFkTbNN38w1KS/oWHDPviIFlofGhdFci\nAVF/nOGQuDUy7k79joHKHGBeQ1oHdP30WAhur2DwxaH/ivjkHsRD1T642x+bve+5\nCBDFDQ2jqxgMdMMZpAyReL2ALx12KuKwDHbiktM805aARmoMUy8OcCHI1OUoi0C1\nZu23OIJgIL0CgYEAwP7/5O1OVVZ9kX6CDM02Jk7He8Yia1AGQPsq6TPTh4fQkmYK\nG5iHLcKPcKTNRUXFf5D3sXtWrbjMExfOVnccaTOcak5WVwqZOnwbA2l5wQg9Rgrm\n48z2vxK7litNt8Xj+MF4fCOxFAnmZqKUDow5pPPDJdMLsWay/+PQII8mIPMCgYEA\nk7JnSaEUGpA/p4c0aZI4EhAilqKFfjkGDqbARy1a/RHq/BgrgLVaBFVe6JQkTzEw\nwv1ka9IxbeEhfJhDxBK4VyqoKJJCxGFHrRR/0EGv2OAfvqxd6LyDOdmp+BHmHXOE\niYvTOJ6Vhv66ji57648TO8MMRTazDwWjNcAlhHlI2JkCgYBer8AphhJ3NQu7OeNw\nisHXhrwNqYFRuJdMUQBixHIqNUU0XMn38Pfev679qmkxuOHpQxpR8kYGJ32kEW2K\nXpXjZPmk1Zee4FjKOt0YZzaH68Ke4Lx2EjAfeo9TIEd8wGVw4Z1Uf9Vk/wEefyqO\ncn8ky3kK//yv7nKU4TUdBzdEhw==\n-----END PRIVATE KEY-----";
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
