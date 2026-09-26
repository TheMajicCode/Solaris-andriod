package K5;

/* JADX INFO: renamed from: K5.T0$g, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class RunnableC0040T0$g implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ W2.s f1586f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ T0 f1587g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ String f1588h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    final /* synthetic */ String f1589i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    final /* synthetic */ String f1590j;

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    final /* synthetic */ long f1591k;

    RunnableC0040T0$g(W2.s sVar, T0 t6, String str, String str2, String str3, long j6) {
        this.f1586f = sVar;
        this.f1587g = t6;
        this.f1588h = str;
        this.f1589i = str2;
        this.f1590j = str3;
        this.f1591k = j6;
    }

    /* JADX WARN: Code duplicated, block: B:12:0x0048  */
    @Override // java.lang.Runnable
    public final void run() {
        try {
            this.f1586f.i(T0.x(this.f1587g).l(this.f1588h, this.f1589i, this.f1590j, this.f1591k));
        } catch (Exception e6) {
            String message = e6.getMessage();
            if (message == null) {
                message = "HEALTH_READ_FAILED";
            } else {
                if (!p143v3.U.h("CANCELLED", "HEALTH_RANGE_INVALID", "HEALTH_SCOPE_INVALID", "HEALTH_RANGE_TOO_DENSE", "HEALTH_READ_TIMEOUT", "HEALTH_PERMISSION_REQUIRED", "HEALTH_PERMISSION_REVOKED", "HEALTH_PROVIDER_UNAVAILABLE", "HEALTH_PAGINATION_FAILED", "HEALTH_PROVIDER_READ_FAILED", "ANDROID_14_HEALTH_CONNECT_REQUIRED").contains(message)) {
                    message = null;
                }
                if (message == null) {
                    message = "HEALTH_READ_FAILED";
                }
            }
            this.f1586f.reject(message, message, null);
        }
    }
}
