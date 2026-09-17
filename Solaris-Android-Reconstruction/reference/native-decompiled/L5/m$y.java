package L5;

import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;
import p027d5.C0681d;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$y implements Function2 {
    /* JADX WARN: Multi-variable type inference failed */
    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        String str = (String) sVar;
        byte[] bytes = str.getBytes(C0681d.f11148b);
        J3.l.e(bytes, "getBytes(...)");
        if (bytes.length > 16777216) {
            throw new IllegalArgumentException("RECOVERY_SIZE");
        }
        n.f1840a.a(str);
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
