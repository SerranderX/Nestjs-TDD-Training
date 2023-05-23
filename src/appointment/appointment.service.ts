import { Injectable } from '@nestjs/common';
import { Appointment } from '@appointment/models/appointment.model';
import { PatientService } from '@patient/patient.service';

export interface AppointmentInput {
  patientId: number;
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class AppointmentService {
  public constructor(private readonly patientService: PatientService) {}

  public async scheduleAppointment(
    appointmentData: AppointmentInput,
  ): Promise<Appointment> {
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

    const patientExists = await this.patientService.doesPatientExist(
      appointmentData.patientId,
    );

    if (!patientExists) {
      throw new Error('Patient does not exist');
    }

    return {
      ...appointmentData,
      confirmed: false,
    };
  }

  private endInTheSameDayAndMonth(appointmentData: AppointmentInput): boolean {
    const differentDays =
      appointmentData.endTime.getUTCDate() !==
      appointmentData.startTime.getUTCDate();

    const differentMonths =
      appointmentData.endTime.getUTCMonth() !==
      appointmentData.startTime.getUTCMonth();

    // Now we also check for years
    const differentYears =
      appointmentData.endTime.getUTCFullYear() !==
      appointmentData.startTime.getUTCFullYear();

    return differentDays || differentMonths || differentYears;
  }

  private endThirdtyMinutesBeforeStart(
    appointmentData: AppointmentInput,
  ): boolean {
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
