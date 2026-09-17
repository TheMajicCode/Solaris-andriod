package K5;

import android.health.connect.HealthConnectManager;
import android.health.connect.ReadRecordsRequest;
import android.os.OutcomeReceiver;
import java.util.concurrent.Executor;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class P {
    public static /* bridge */ /* synthetic */ void a(HealthConnectManager healthConnectManager, ReadRecordsRequest readRecordsRequest, Executor executor, OutcomeReceiver outcomeReceiver) {
        healthConnectManager.readRecords(readRecordsRequest, executor, outcomeReceiver);
    }
}
