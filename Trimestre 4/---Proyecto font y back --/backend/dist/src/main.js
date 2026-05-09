"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.useStaticAssets('C:/Users/angie/backend/uploads', {
        prefix: '/uploads/',
    });
    app.enableCors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API de Productos')
        .setDescription('API para gestionar productos, categorías y clasificaciones')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'x-api-key')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true,
            filter: true,
            showRequestDuration: true,
        },
    });
    BigInt.prototype.toJSON = function () {
        return this.toString();
    };
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: false,
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map