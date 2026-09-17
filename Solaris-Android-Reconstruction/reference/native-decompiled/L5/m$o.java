package L5;

import android.app.Activity;
import kotlin.jvm.functions.Function1;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$o implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1829f;

    public m$o(m mVar) {
        this.f1829f = mVar;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "<destruct>");
        if (m.u(this.f1829f, (W2.s) objArr[0])) {
            try {
                synchronized (m.L(this.f1829f)) {
                    m.L(this.f1829f).i("solaris-attachment-unlock-check/1");
                }
                Activity activityA = this.f1829f.a().a();
                if (activityA == null) {
                    throw new IllegalStateException("VAULT_UNAVAILABLE");
                }
                p$a p_a = new p$a();
                m.P(this.f1829f, p_a);
                m mVar = this.f1829f;
                m.R(mVar, (m.B(mVar) + 1) % 9000);
                m mVar2 = this.f1829f;
                m.Q(mVar2, m.B(mVar2) + 10000);
                activityA.runOnUiThread(new RunnableC0112m$c(this.f1829f, p_a, activityA, m.A(this.f1829f)));
            } catch (Exception unused) {
                m.x(this.f1829f, "ATTACHMENT_UNAVAILABLE");
            }
        }
        return A.f16167a;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
