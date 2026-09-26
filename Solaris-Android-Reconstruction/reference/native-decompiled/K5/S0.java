package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class S0 implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1522f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ T0 f1523g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Function1 f1524h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    public final /* synthetic */ String f1525i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    public final /* synthetic */ String f1526j;

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    public final /* synthetic */ Function1 f1527k;

    public /* synthetic */ S0(long j6, T0 t6, Function1 function1, String str, String str2, Function1 function2) {
        this.f1522f = j6;
        this.f1523g = t6;
        this.f1524h = function1;
        this.f1525i = str;
        this.f1526j = str2;
        this.f1527k = function2;
    }

    @Override // java.lang.Runnable
    public final void run() {
        T0.t(this.f1522f, this.f1523g, this.f1524h, this.f1525i, this.f1526j, this.f1527k);
    }
}
