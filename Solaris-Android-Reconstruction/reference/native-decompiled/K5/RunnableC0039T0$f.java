package K5;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import p143v3.AbstractC0982q;

/* JADX INFO: renamed from: K5.T0$f, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class RunnableC0039T0$f implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ long f1579f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ T0 f1580g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ List f1581h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    final /* synthetic */ W2.s f1582i;

    RunnableC0039T0$f(long j6, T0 t6, List list, W2.s sVar) {
        this.f1579f = j6;
        this.f1580g = t6;
        this.f1581h = list;
        this.f1582i = sVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        try {
            if (this.f1579f != T0.z(this.f1580g)) {
                throw new IllegalStateException("CANCELLED");
            }
            T2.a aVarV = this.f1580g.a().v();
            if (aVarV == null) {
                throw new IllegalStateException("HEALTH_PERMISSION_UNAVAILABLE");
            }
            T0$f$a t0$f$a = new T0$f$a(this.f1582i, this.f1580g);
            List list = this.f1581h;
            ArrayList arrayList = new ArrayList(AbstractC0982q.u(list, 10));
            Iterator it = list.iterator();
            while (it.hasNext()) {
                arrayList.add((String) p143v3.L.i(C0071f0.f1640a.b(), (String) it.next()));
            }
            String[] strArr = (String[]) arrayList.toArray(new String[0]);
            aVarV.a(t0$f$a, (String[]) Arrays.copyOf(strArr, strArr.length));
        } catch (Exception unused) {
            this.f1582i.reject("HEALTH_PERMISSION_UNAVAILABLE", "HEALTH_PERMISSION_UNAVAILABLE", null);
        }
    }
}
