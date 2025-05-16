import { SensorDataEvent } from './sensor-data.event';
import { SensorBasedEventAndTaskMgtService } from '../sensor-based-event-and-task-mgt/sensor-based-event-and-task-mgt.service';
export declare class SensorEventHandlerService {
    private readonly sensorTaskService;
    private readonly logger;
    constructor(sensorTaskService: SensorBasedEventAndTaskMgtService);
    handleSensorData(event: SensorDataEvent): Promise<void>;
}
