import SCFAPIClient from "./index.js";
import axios from "axios";

const SCF = new SCFAPIClient("https://provider.com/API/", null, "test_api_token");

let configs = {};

SCF.testMode((config) => {
    let method = config.params["method"];

    configs[method] = config;
});

let schema = (await axios.get("https://sky.dssoftware.ru/API/docs/schema.php")).data;

let tests = [];

for (const [section_name, methods] of Object.entries(schema)) {
    for (const [method_name, method] of Object.entries(methods)) {
        function testFail(issue) {
            tests.push({
                method: `${section_name}.${method_name}`,
                result: false,
                reason: issue,
            });
        }
        function testSuccess() {
            tests.push({
                method: `${section_name}.${method_name}`,
                result: true,
            });
        }

        async function checkMethod() {
            let function_handler = SCF.API?.[section_name]?.[method_name];
            if (!function_handler) {
                testFail("Method is not implemented.");
                return;
            }

            function_handler = function_handler.bind(SCF.API[section_name]);
            let params = function_handler.toString().split("{")[0].split(",").length;

            try {
                await function_handler(...Array(params).fill("parameter"));
            } catch (e) {}

            let config = configs?.[`${section_name}.${method_name}`];

            if (!config) {
                testFail("The method did not return a config.");
                return;
            }

            if (config.method !== method.docs.method) {
                testFail(`Failed HTTP Method check; expected ${method.docs.method}, got ${config.method}`);
                return;
            }

            if (!config.headers["Authorization"] && method.auth.level >= 0) {
                testFail(`Failed Authorization check; expected an authorization header, got none.`);
                return;
            }

            for (const [arg_name, arg] of Object.entries(method.arguments)) {
                if(!arg.required){
                    continue;
                }
                if (arg.source == "Post Body Value") {
                    if (!Object.keys(config.data).includes(arg_name)) {
                        testFail(`Failed Parameter check; expected parameter ${arg_name}, got none.`);
                        return;
                    }
                }
                if (arg.source == "Get Parameter Value") {
                    if (!Object.keys(config.params).includes(arg_name)) {
                        testFail(`Failed Parameter check; expected parameter ${arg_name}, got none.`);
                        return;
                    }
                }
            }

            testSuccess();
        }

        await checkMethod();
    }
}

let passed = 0;

for (const test of tests) {
    if (test.result) {
        console.log(`\x1b[42m Success \x1b[0m\x1b[32m Test passed: ${test.method} ✅\x1b[0m`);
        passed++;
        continue;
    }
    console.log(`\x1b[41m Fail \x1b[0m\x1b[31m Test failed: ${test.method} ❌\x1b[0m`);
    console.log(`\x1b[31m${test.reason}\x1b[0m`);
}

console.log();

let percent_passed = Math.round((passed / tests.length) * 1000) / 10;
if (passed != tests.length) {
    console.log(
        `\x1b[41m Tests Failed \x1b[0m\x1b[31m ${passed} / ${tests.length} (${percent_passed}%); ${
            tests.length - passed
        } tests failed.\x1b[0m`
    );

    throw "Some tests were failed."
} else {
    console.log(
        `\x1b[42m Tests Passed \x1b[0m\x1b[32m ${passed} / ${tests.length} (${percent_passed}%) tests passed.\x1b[0m`
    );
}
