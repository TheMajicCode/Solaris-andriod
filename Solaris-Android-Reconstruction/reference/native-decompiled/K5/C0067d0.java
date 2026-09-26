package K5;

import android.health.connect.HealthConnectManager;
import android.health.connect.ReadRecordsRequestUsingFilters$Builder;
import android.os.OutcomeReceiver;
import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.d0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class C0067d0 implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ HealthConnectManager f1631f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ ReadRecordsRequestUsingFilters$Builder f1632g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ C0069e0 f1633h;

    public /* synthetic */ C0067d0(HealthConnectManager healthConnectManager, ReadRecordsRequestUsingFilters$Builder readRecordsRequestUsingFilters$Builder, C0069e0 c0069e0) {
        this.f1631f = healthConnectManager;
        this.f1632g = readRecordsRequestUsingFilters$Builder;
        this.f1633h = c0069e0;
    }

    @Override // kotlin.jvm.functions.Function1
    public final Object q(Object obj) {
        return C0069e0.a(this.f1631f, this.f1632g, this.f1633h, (OutcomeReceiver) obj);
    }
}
