'use strict';

/**
 * Content Security Policy (CSP)
 * https://www.owasp.org/index.php/Content_Security_Policy
 * @param {Object} options The CSP policy.
 */
module.exports = function (options) {
    var policyRules = options && options.policy,
        isReportOnly = options && options.reportOnly,
        reportUri = options && options.reportUri,
        value, name;

    name = 'content-security-policy';

    if (isReportOnly) {
        name += '-report-only';
    }

    value = createPolicyString(policyRules);

    if (reportUri) {
        if (value !== '') {
            value += '; ';
        }
        value += 'report-uri ' + reportUri;
    }

    return function csp(req, res, next) {
        res.header(name, value);
        next();
    };
};

var createPolicyString = module.exports.createPolicyString = function (policy) {
    var entries;

    if (typeof policy === 'string') {
        return policy;
    }

    if (Array.isArray(policy)) {
        return policy.map(createPolicyString).join('; ');
    }

    if (typeof policy === 'object' && policy !== null) {
        entries = Object.keys(policy).map(function (directive) {
            if (policy[directive] === 0 || policy[directive]) {
                directive += ' ' + policy[directive];
            }
            return directive;
        });

        return createPolicyString(entries);
    }

    throw Error('invalid csp policy - must be array, string, or plain object');
};
