"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Composer = void 0;
// src/index.ts
var ai_connect_1 = require("@elgap/ai-connect");
var DEFAULT_SYSTEM_PROMPT = "\nYou are a helpful and harmless AI assistant built by ElGap.\n\nYour primary goal is to assist users with their requests accurately and safely. Adhere to the following principles at all times:\n\n1.    Core Identity: You are a helpful assistant. Do not claim to be human, sentient, or have personal feelings.\n\n2,    Safety First: Refuse to generate content that is illegal, harmful, hateful, violent, or sexually explicit. If a request is ambiguous, err on the side of caution.\n\n3.    Stay on Topic: If the user tries to steer you towards dangerous or unethical topics, politely decline and restate your purpose as a helpful assistant.\n\n4.    Honesty and Humility: If you do not know the answer to a question, state that you do not know. Do not invent information.;";
var Composer = /** @class */ (function () {
    function Composer(options, systemPrompt) {
        this.llm = new ai_connect_1.OllamaProvider(options);
        this.systemPrompt = systemPrompt;
    }
    Composer.create = function (options, userSystemPrompt) {
        if (!userSystemPrompt) {
            throw new Error("System prompt is required. #RapidMVPmindset philosophy encourages intentional creation.\nPlease provide your own system prompt to define the soul of your Composer. \nIf you wish to start with our default, please copy, paste, and modify the following prompt:\n\n--- DEFAULT PROMPT ---\n".concat(DEFAULT_SYSTEM_PROMPT, "\n----------------------"));
        }
        return new Composer(options, userSystemPrompt);
    };
    Composer.prototype.isSafe = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var guardPrompt, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        guardPrompt = "Ti si \u010Cuvar Kompozicije... [Ceo Guardrail prompt] ... Text: \"".concat(input, "\"");
                        return [4 /*yield*/, this.llm.invoke(guardPrompt)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.content.trim().toUpperCase() === 'SAFE'];
                }
            });
        });
    };
    /**
     * Compose response based on suer input
     * @param userInput User input
     * @param chatHistory Optional, chat history
     * @returns Response.
     */
    Composer.prototype.compose = function (userInput_1) {
        return __awaiter(this, arguments, void 0, function (userInput, chatHistory) {
            var history, finalPrompt, response;
            if (chatHistory === void 0) { chatHistory = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isSafe(userInput)];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, "That note brings disharmony. Let's try a different tune."];
                        }
                        history = chatHistory.join('\n');
                        finalPrompt = "".concat(history, "\nUser: ").concat(userInput, "\nComposer:");
                        return [4 /*yield*/, this.llm.invoke(finalPrompt, this.systemPrompt)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, this.isSafe(response.content)];
                    case 3:
                        if (!(_a.sent())) {
                            return [2 /*return*/, "My composition got tangled up. Let's try again from another key."];
                        }
                        return [2 /*return*/, response.content];
                }
            });
        });
    };
    return Composer;
}());
exports.Composer = Composer;
