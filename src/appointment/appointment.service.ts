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

    if (this.endThirdtyMinutesBeforeStart(appointmentData))
      throw new Error(
        "Appointment's endTime should be after startTime and a minimun of thirdty minutes must elapse",
      );

    if (this.endInTheSameDayAndMonth(appointmentData)) {
      throw new Error(
        "Appointment's endTime should be in the same day as start time's",
      );
    }

    return {
      ...appointmentData,
      confirmed: false,
    };
  }

  private endInTheSameDayAndMonth(appointmentData: AppointmentInput) {
    return (
      appointmentData.endTime.getUTCDate() !==
        appointmentData.startTime.getUTCDate() ||
      appointmentData.endTime.getUTCMonth() !==
        appointmentData.startTime.getUTCMonth()
    );
  }

  private endThirdtyMinutesBeforeStart(appointmentData: AppointmentInput) {
    return (
      appointmentData?.endTime == appointmentData?.startTime ||
      Math.round(
        Math.abs(
          appointmentData?.startTime.getTime() -
            appointmentData?.endTime.getTime(),
        ) / 60000,
      ) < 30
    );
  }
}
