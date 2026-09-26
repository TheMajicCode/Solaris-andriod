package K5;

import android.os.SystemClock;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class T0$m0 implements Function1 {
    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "it");
        return p143v3.L.l(p137u3.s.a("wallTimeMs", Long.valueOf(System.currentTimeMillis())), p137u3.s.a("monotonicMs", Long.valueOf(SystemClock.elapsedRealtime())), p137u3.s.a("clockId", T0.C()));
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
