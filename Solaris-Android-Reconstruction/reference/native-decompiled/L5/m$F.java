package L5;

import android.app.Activity;
import com.facebook.react.bridge.BaseJavaModule;
import java.nio.charset.Charset;
import kotlin.jvm.functions.Function2;
import org.json.JSONObject;
import p027d5.C0681d;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$F implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1780f;

    public m$F(m mVar) {
        this.f1780f = mVar;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<destruct>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        String str = (String) objArr[0];
        if (m.u(this.f1780f, sVar)) {
            try {
                Charset charset = C0681d.f11148b;
                byte[] bytes = str.getBytes(charset);
                J3.l.e(bytes, "getBytes(...)");
                if (bytes.length >= 16775168) {
                    throw new IllegalArgumentException("RECOVERY_SIZE");
                }
                n.f1840a.a(str);
                String string = new JSONObject(str).put("ownerCapsule", m.L(this.f1780f).n()).toString();
                J3.l.e(string, "toString(...)");
                byte[] bytes2 = string.getBytes(charset);
                J3.l.e(bytes2, "getBytes(...)");
                Activity activityA = this.f1780f.a().a();
                if (activityA == null) {
                    throw new IllegalStateException("VAULT_UNAVAILABLE");
                }
                y.f1874a.f(activityA, true, new C0113m$d(bytes2, this.f1780f, activityA));
            } catch (Exception unused) {
                m.j0(this.f1780f, null, 1, null);
            }
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
