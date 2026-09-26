package K5;

import android.health.connect.AggregateRecordsRequest;
import android.health.connect.HealthConnectManager;
import android.os.OutcomeReceiver;
import java.util.concurrent.Executor;

/* JADX INFO: renamed from: K5.t, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class AbstractC0097t {
    public static /* bridge */ /* synthetic */ void a(HealthConnectManager healthConnectManager, AggregateRecordsRequest aggregateRecordsRequest, Executor executor, OutcomeReceiver outcomeReceiver) {
        healthConnectManager.aggregate(aggregateRecordsRequest, executor, outcomeReceiver);
    }
}
