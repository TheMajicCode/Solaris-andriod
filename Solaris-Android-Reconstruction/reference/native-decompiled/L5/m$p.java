package L5;

import android.app.Activity;
import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$p implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1830f;

    public m$p(m mVar) {
        this.f1830f = mVar;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        if (m.u(this.f1830f, sVar)) {
            m.W(this.f1830f, null);
            Activity activityA = this.f1830f.a().a();
            if (activityA == null) {
                m.j0(this.f1830f, null, 1, null);
            } else {
                activityA.runOnUiThread(new RunnableC0114m$e(activityA, this.f1830f));
            }
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
