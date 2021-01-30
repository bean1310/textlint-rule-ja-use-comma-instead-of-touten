// Copyright (c) 2021 BEAN
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


"use strict";

import { TextlintRuleReporter } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";

const japaneseRegExp = /(?:[々〇〻\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])/;
const badComma = /[、\,]/;

const reporter: TextlintRuleReporter = function (context)
{
    const {Syntax, RuleError, report, fixer, getSource} = context;
    const ruleHelper = new RuleHelper(context);

    return {
        [Syntax.Str](node)
        {
            if (ruleHelper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }

            const targetText = getSource(node);

            if (!japaneseRegExp.test(targetText)) {
                return;
            }
            
            const validationResults = validateBadComma(targetText, badComma);

            validationResults.forEach(result => {
                if (!result.valid && result.index != undefined) {
                    const ruleError = new RuleError("Disallow to use 読点", {
                        index: result.index,
                        fix: fixer.replaceTextRange([result.index, result.index + 1], "，")
                    })
                    report(node, ruleError);
                }
            });

        }
    }
};

/**
 * 
 * @param text Text for validation
 * @param badComma Regular expression of disallow character
 */
function validateBadComma(text:string, badComma: RegExp) {
    let baseIndex = 0;
    let tmpText = text;
    let result = [];
    while(tmpText) {
        if (badComma.test(tmpText)) {
            const index = tmpText.search(badComma) + baseIndex;
            result.push({
                valid: false,
                index: index
            });
            tmpText = tmpText.substr(index);
            baseIndex += index;
        } else {
            result.push({
                valid: true
            });
            break;
        }
    }
    
    return result;
};

module.exports = {
    linter: reporter,
    fixer: reporter
};