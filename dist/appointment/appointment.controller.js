"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const appointment_service_1 = require("./appointment.service");
const pagination_query_dto_1 = require("./dto/pagination-query.dto");
const book_appointments_dto_1 = require("./dto/book-appointments.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const availability_query_dto_1 = require("./dto/availability-query.dto");
let AppointmentController = class AppointmentController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async getAppointmentsOfCounselor(req, paginationQuery) {
        return this.appointmentsService.getAppointmentsOfCounselor(req.user.id, paginationQuery);
    }
    async getAppointmentsOfUser(req, paginationQuery) {
        return this.appointmentsService.getAppointmentsOfUser(req.user.id, paginationQuery);
    }
    async bookAppointment(req, bookAppointmentDto) {
        bookAppointmentDto.userId = req.user.id;
        return this.appointmentsService.bookAppointment(bookAppointmentDto);
    }
    async getAvailableSlots(query) {
        return this.appointmentsService.getAvailableSlots(Number(query.counselorId), query.date);
    }
};
exports.AppointmentController = AppointmentController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('counselor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all, past & upcoming appointments for the counselor.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of appointments for the counselor' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentsOfCounselor", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all, past & upcoming appointments for the user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of appointments for the user' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentsOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Book an appointment!' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment booked successfully!' }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Bad Request - Appointment already booked at the selected time OR other validation errors',
        content: {
            'application/json': {
                examples: {
                    CounselorAlreadyBooked: {
                        summary: 'Counselor is already booked',
                        value: {
                            statusCode: 400,
                            message: 'This counselor is already booked at the selected time.',
                            error: 'Bad Request',
                        },
                    },
                    UserAlreadyBooked: {
                        summary: 'User has an existing appointment at the same time',
                        value: {
                            statusCode: 400,
                            message: 'This user already has an appointment at the selected time.',
                            error: 'Bad Request',
                        },
                    },
                    CounselorNotFound: {
                        summary: 'Counselor not found',
                        value: {
                            statusCode: 400,
                            message: 'Counselor not found',
                            error: 'Bad Request',
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Post)('book'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, book_appointments_dto_1.BookAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('available-slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available slots for a selected counselor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available slots retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input (e.g., missing parameters, invalid date format)' }),
    (0, swagger_1.ApiQuery)({ name: 'counselorId', required: true, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String, example: '2025-06-15' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_query_dto_1.AvailabilityQueryDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAvailableSlots", null);
exports.AppointmentController = AppointmentController = __decorate([
    (0, swagger_1.ApiTags)('Appointment'),
    (0, common_1.Controller)('appointment'),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService])
], AppointmentController);
//# sourceMappingURL=appointment.controller.js.map