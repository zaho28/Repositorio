"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnableCors = EnableCors;
const common_1 = require("@nestjs/common");
function EnableCors(origin = 'http://localhost:5173') {
    return (0, common_1.applyDecorators)((0, common_1.Header)('Access-Control-Allow-Origin', origin), (0, common_1.Header)('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS'), (0, common_1.Header)('Access-Control-Allow-Headers', 'Content-Type, Authorization'), (0, common_1.Header)('Access-Control-Allow-Credentials', 'true'));
}
//# sourceMappingURL=cors.decorator.js.map