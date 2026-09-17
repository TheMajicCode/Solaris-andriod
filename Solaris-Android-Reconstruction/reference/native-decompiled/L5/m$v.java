package L5;

import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;
import org.json.JSONException;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$v implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1836f;

    public m$v(m mVar) {
        this.f1836f = mVar;
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final void b(Object[] objArr, W2.s sVar) throws JSONException {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        m.L(this.f1836f).i((String) sVar);
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) throws JSONException {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
