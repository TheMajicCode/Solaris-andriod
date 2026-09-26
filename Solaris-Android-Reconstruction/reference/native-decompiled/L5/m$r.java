package L5;

import android.app.Activity;
import kotlin.jvm.functions.Function1;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$r implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1832f;

    public m$r(m mVar) {
        this.f1832f = mVar;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "<destruct>");
        if (m.u(this.f1832f, (W2.s) objArr[0])) {
            m.W(this.f1832f, null);
            Activity activityA = this.f1832f.a().a();
            if (activityA == null) {
                m.j0(this.f1832f, null, 1, null);
            } else {
                activityA.runOnUiThread(new RunnableC0114m$e(activityA, this.f1832f));
            }
        }
        return A.f16167a;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
