import { Injectable } from '@nestjs/common';
import { Appointment } from '@appointment/models/appointment.model';

export interface AppointmentInput {
  patientId: number;
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class AppointmentService {
  public scheduleAppointment(appointmentData: AppointmentInput): Appointment {
    if (appointmentData?.endTime < appointmentData?.startTime)
      throw new Error("Appointment's endTime should be after startTime");

    if (
      appointmentData?.endTime == appointmentData?.startTime ||
      Math.round(
        Math.abs(
          appointmentData?.startTime.getTime() -
            appointmentData?.endTime.getTime(),
        ) / 60000,
      ) < 30
    )
      throw new Error(
        "Appointment's endTime should be after startTime and a minimun of thirdty minutes must elapse",
      );

    return {
      ...appointmentData,
      confirmed: false,
    };
  }
}
