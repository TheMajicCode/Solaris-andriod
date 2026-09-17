package L5;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import kotlin.jvm.functions.Function2;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$M implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1785f;

    public m$M(m mVar) {
        this.f1785f = mVar;
    }

    public final void b(Activity activity, p025d3.i iVar) {
        J3.l.f(activity, "sender");
        J3.l.f(iVar, "payload");
        int iA = iVar.a();
        int iB = iVar.b();
        Intent intentC = iVar.c();
        if (m.M(this.f1785f) != null) {
            if (iA == 6142 || iA == 6143 || iA == m.G(this.f1785f) || iA == m.A(this.f1785f)) {
                if (iA == m.G(this.f1785f)) {
                    if (!m.D(this.f1785f)) {
                        return;
                    }
                    Long lF = m.F(this.f1785f);
                    long jC = m.C(this.f1785f);
                    if (lF == null || lF.longValue() != jC) {
                        return;
                    }
                }
                if (iB != -1) {
                    m.x(this.f1785f, "CANCELLED");
                    return;
                }
                if (iA == m.A(this.f1785f)) {
                    Uri data = intentC != null ? intentC.getData() : null;
                    p$a p_aZ = m.z(this.f1785f);
                    if (data == null || p_aZ == null) {
                        m.x(this.f1785f, "ATTACHMENT_READ");
                        return;
                    } else {
                        m.H(this.f1785f).execute(new RunnableC0115m$f(this.f1785f, data, p_aZ, activity));
                        return;
                    }
                }
                if (iA == m.G(this.f1785f)) {
                    Long lF2 = m.F(this.f1785f);
                    if (lF2 != null) {
                        if (lF2.longValue() == m.C(this.f1785f)) {
                            m.S(this.f1785f, null);
                            m.O(this.f1785f, lF2.longValue(), true);
                            return;
                        }
                        return;
                    }
                    return;
                }
                if (iA == 6142) {
                    Uri data2 = intentC != null ? intentC.getData() : null;
                    m mVar = this.f1785f;
                    if (data2 == null) {
                        m.j0(mVar, null, 1, null);
                        return;
                    } else {
                        m.t(mVar, new C0116m$g(mVar, data2));
                        return;
                    }
                }
                if (iA == 6143) {
                    Uri data3 = intentC != null ? intentC.getData() : null;
                    if (data3 == null) {
                        m.j0(this.f1785f, null, 1, null);
                    } else {
                        y.f1874a.f(activity, false, new C0117m$h(this.f1785f, data3));
                    }
                }
            }
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Activity) obj, (p025d3.i) obj2);
        return A.f16167a;
    }
}
