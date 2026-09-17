package L5;

import java.util.Arrays;
import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: L5.m$i, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class C0118m$i implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public static final C0118m$i f1823f = new C0118m$i();

    C0118m$i() {
    }

    public final CharSequence b(byte b6) {
        String str = String.format("%02x", Arrays.copyOf(new Object[]{Byte.valueOf(b6)}, 1));
        J3.l.e(str, "format(...)");
        return str;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b(((Number) obj).byteValue());
    }
}
