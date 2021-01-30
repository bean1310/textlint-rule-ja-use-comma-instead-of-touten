// Copyright (c) 2021 BEAN
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
const rule = require("../src/textlint-rule-ja-use-comma-instead-of-touten");

tester.run("use-comma-instead-of-touten", rule, {
    valid: [
        "今日は，いい天気だ．",
        "それは，見ざる，言わざる，聞かざる．",
        "Google, Apple, Facebook and Amazon"
    ],
    invalid: [
        {
            text: "明日は、雨だ．",
            output: "明日は，雨だ．",
            errors: [
                {
                    message: `Disallow to use 読点`,
                    line: 1,
                    column: 4
                }
            ]
        },
        {
            text: "今日は、快晴だが，\n明日は、雨の予報があり、傘を持っていく必要があるだろう．",
            output: "今日は，快晴だが，\n明日は，雨の予報があり，傘を持っていく必要があるだろう．",
            errors: [
                {
                    message: `Disallow to use 読点`,
                    line: 1,
                    column: 4
                },
                {
                    message: `Disallow to use 読点`,
                    line: 2,
                    column: 4
                },
                {
                    message: `Disallow to use 読点`,
                    line: 2,
                    column: 12
                }
            ]
        }
    ]
});