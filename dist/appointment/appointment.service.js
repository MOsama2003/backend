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
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
const requested_counsellar_entity_1 = require("../requested-counsellar/entities/requested-counsellar.entity");
let AppointmentService = class AppointmentService {
    constructor(appointmentRepository, counselorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.counselorRepository = counselorRepository;
    }
    async getAppointmentsOfCounselor(counselorId, paginationQuery) {
        const { page, limit = 10, upcoming } = paginationQuery;
        counselorId = 10;
        const currentDate = new Date();
        let whereCondition = { counselor: { id: counselorId } };
        if (upcoming === true) {
            whereCondition = {
                counselor: { id: counselorId },
                appointmentDate: (0, typeorm_2.MoreThanOrEqual)(currentDate)
            };
        }
        else if (upcoming === false) {
            whereCondition = {
                counselor: { id: counselorId },
                appointmentDate: (0, typeorm_2.LessThan)(currentDate)
            };
        }
        else if (upcoming === undefined || upcoming === null) {
            whereCondition = {
                counselor: { id: counselorId },
            };
        }
        const [appointments, total] = await this.appointmentRepository.findAndCount({
            where: whereCondition,
            relations: ['counselor'],
            take: limit,
            skip: (page - 1) * limit,
            order: { appointmentDate: 'DESC' },
        });
        const totalPages = Math.ceil(total / limit);
        return {
            metaData: {
                total,
                currentPage: page,
                totalPages,
                limit
            },
            data: appointments,
        };
    }
    async getAppointmentsOfUser(userId, paginationQuery) {
        const { page, limit = 10, upcoming } = paginationQuery;
        const currentDate = new Date();
        let whereCondition = { userId };
        if (upcoming === true) {
            whereCondition = {
                userId,
                appointmentDate: (0, typeorm_2.MoreThanOrEqual)(currentDate)
            };
        }
        else if (upcoming === false) {
            whereCondition = {
                userId,
                appointmentDate: (0, typeorm_2.LessThan)(currentDate)
            };
        }
        else if (upcoming === undefined || upcoming === null) {
            whereCondition = {
                userId,
            };
        }
        const [appointments, total] = await this.appointmentRepository.findAndCount({
            where: whereCondition,
            relations: ['counselor'],
            take: limit,
            skip: (page - 1) * limit,
            order: { appointmentDate: 'DESC' },
        });
        const totalPages = Math.ceil(total / limit);
        return {
            metaData: {
                total,
                currentPage: page,
                totalPages,
                limit
            },
            data: appointments,
        };
    }
    async bookAppointment(bookAppointmentDto) {
        const { userId, counselorId, appointmentDate } = bookAppointmentDto;
        const requestedDate = new Date(appointmentDate);
        requestedDate.setSeconds(0, 0);
        requestedDate.setMilliseconds(0);
        const [counselor, existingAppointmentForCounselor, existingAppointmentForUser] = await Promise.all([
            this.counselorRepository.findOne({ where: { id: counselorId } }),
            this.appointmentRepository.findOne({
                where: {
                    counselor: { id: counselorId },
                    appointmentDate: requestedDate,
                },
            }),
            this.appointmentRepository.findOne({
                where: {
                    userId,
                    appointmentDate: requestedDate,
                },
            }),
        ]);
        if (!counselor) {
            throw new common_1.BadRequestException('Counselor not found');
        }
        if (existingAppointmentForCounselor) {
            throw new common_1.BadRequestException('This counselor is already booked at the selected time.');
        }
        if (existingAppointmentForUser) {
            throw new common_1.BadRequestException('This user already has an appointment at the selected time.');
        }
        const newAppointment = this.appointmentRepository.create({
            userId,
            appointmentDate: requestedDate,
            counselor,
        });
        return await this.appointmentRepository.save(newAppointment);
    }
    async getAvailableSlots(counselorId, date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        parsedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsedDate < today) {
            throw new common_1.BadRequestException('Cannot book appointments for past dates');
        }
        const counselor = await this.counselorRepository.findOne({
            where: { id: counselorId },
            select: ['workingDays', 'startTime', 'endTime'],
        });
        if (!counselor) {
            throw new common_1.BadRequestException('Counselor not found');
        }
        const workingDays = counselor.workingDays?.map(Number) ?? [1, 2, 3, 4, 5];
        const dayOfWeek = parsedDate.getDay() === 0 ? 7 : parsedDate.getDay();
        if (!workingDays.includes(dayOfWeek)) {
            return { message: 'Counselor is unavailable on this date', availableSlots: [] };
        }
        if (!counselor.startTime || !counselor.endTime) {
            throw new common_1.BadRequestException('Counselor working hours not set');
        }
        const startHour = parseInt(counselor.startTime.split(':')[0]);
        const endHour = parseInt(counselor.endTime.split(':')[0]);
        if (isNaN(startHour) || isNaN(endHour)) {
            throw new common_1.BadRequestException('Invalid working hours format');
        }
        const allSlots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            const slot = new Date(parsedDate);
            slot.setHours(hour, 0, 0, 0);
            allSlots.push(slot.toISOString());
        }
        const startOfDay = new Date(parsedDate);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);
        const bookedAppointments = await this.appointmentRepository.find({
            where: {
                counselor: { id: counselorId },
                appointmentDate: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            select: ['appointmentDate'],
        });
        const availableSlots = allSlots.filter((slot) => !bookedAppointments.some((appt) => appt.appointmentDate.toISOString() === slot));
        return {
            counselorId,
            date,
            availableSlots,
            message: availableSlots.length ? 'Available slots found' : 'No available slots for this date',
        };
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(requested_counsellar_entity_1.RequestedCounsellar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map