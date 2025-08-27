import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "@/repositories/user-repository/intf/IUserRepository";
import { UserRepository } from "@/repositories/user-repository/impl/user.repository.impl";
import { IUserService } from "./services/user-service/intf/IUserService";
import { UserService } from "./services/user-service/impl/user.service.impl";
import { IClassesService } from "./services/classes-service/intf/IClassesService";
import { ClassesService } from "./services/classes-service/impl/classes.service.impl";
import { IClassesRepository } from "./repositories/classes-repository/intf/IClassesRepository";
import { ClassesRepository } from "./repositories/classes-repository/impl/classes.repository.impl";
import { IChildrenService } from "./services/children-service/intf/IChildrenService";
import { ChildrenService } from "./services/children-service/impl/children.service.impl";
import { IChildrenRepository } from "./repositories/children-repository/intf/IChildrenRepository";
import { ChildrenRepository } from "./repositories/children-repository/impl/children.repository.impl";
import { HelperService } from "./services/LinkClassHelperService";
import { NotificationRepository } from "./repositories/notification-repository/impl/notification.repository.impl";
import { NotificationService } from "./services/notifcation-service/impl/notification.service.impl";
import { INotificationRepository } from "./repositories/notification-repository/intf/INotificationRepository";
import { INotificationService } from "./services/notifcation-service/intf/INotificationService";
import { IAttendanceRepository } from "./repositories/attendance-repository/intf/IAttendanceRepository";
import { AttedanceRepository } from "./repositories/attendance-repository/impl/attendance.repository.impl";
import { IAttendanceService } from "./services/attendance-service/intf/IAttendanceService";
import { AttendanceHelperService } from "./services/AttendanceHelperService";
import { AttendanceService } from "./services/attendance-service/impl/attendance.service.impl";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register<IUserService>("IUserService", {
  useClass: UserService,
});

container.register<IClassesRepository>("IClassesRepository", {
  useClass: ClassesRepository,
});

container.register<IClassesService>("IClassesService", {
  useClass: ClassesService,
});

container.register<IChildrenRepository>("IChildrenRepository", {
  useClass: ChildrenRepository,
});

container.register<IChildrenService>("IChildrenService", {
  useClass: ChildrenService,
});

container.register<HelperService>("HelperService", {
  useClass: HelperService,
});

container.register<AttendanceHelperService>("AttendanceHelperService", {
  useClass: AttendanceHelperService,
});

container.register<INotificationRepository>("INotificationRepository", {
  useClass: NotificationRepository,
});

container.register<INotificationService>("INotificationService", {
  useClass: NotificationService,
});

container.register<IAttendanceRepository>("IAttendanceRepository", {
  useClass: AttedanceRepository,
});

container.register<IAttendanceService>("IAttendanceService", {
  useClass: AttendanceService,
});