package L5;

import kotlin.jvm.functions.Function1;
import p027d5.C0681d;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$A implements Function1 {
    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "<destruct>");
        String str = (String) objArr[0];
        byte[] bytes = str.getBytes(C0681d.f11148b);
        J3.l.e(bytes, "getBytes(...)");
        if (bytes.length > 16777216) {
            throw new IllegalArgumentException("RECOVERY_SIZE");
        }
        n.f1840a.a(str);
        return Boolean.TRUE;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
