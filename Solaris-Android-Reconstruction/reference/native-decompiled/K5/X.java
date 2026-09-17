package K5;

import android.health.connect.AggregateRecordsRequest;
import android.health.connect.HealthConnectManager;
import android.os.OutcomeReceiver;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class X implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ HealthConnectManager f1624f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ AggregateRecordsRequest f1625g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ C0069e0 f1626h;

    public /* synthetic */ X(HealthConnectManager healthConnectManager, AggregateRecordsRequest aggregateRecordsRequest, C0069e0 c0069e0) {
        this.f1624f = healthConnectManager;
        this.f1625g = aggregateRecordsRequest;
        this.f1626h = c0069e0;
    }

    @Override // kotlin.jvm.functions.Function1
    public final Object q(Object obj) {
        return C0069e0.g(this.f1624f, this.f1625g, this.f1626h, (OutcomeReceiver) obj);
    }
}
