package K5;

import android.health.connect.HealthConnectException;
import android.os.OutcomeReceiver;
import java.util.concurrent.CountDownLatch;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class e0$a implements OutcomeReceiver {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    final /* synthetic */ J3.A f1637a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    final /* synthetic */ CountDownLatch f1638b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    final /* synthetic */ J3.A f1639c;

    e0$a(J3.A a6, CountDownLatch countDownLatch, J3.A a7) {
        this.f1637a = a6;
        this.f1638b = countDownLatch;
        this.f1639c = a7;
    }

    public void a(HealthConnectException healthConnectException) {
        J3.l.f(healthConnectException, "error");
        this.f1639c.f1200f = healthConnectException;
        this.f1638b.countDown();
    }

    public /* bridge */ /* synthetic */ void onError(Throwable th) {
        a(r.a(th));
    }

    public void onResult(Object obj) {
        this.f1637a.f1200f = obj;
        this.f1638b.countDown();
    }
}
