package p027d5;

import J3.l;
import java.nio.charset.Charset;

/* JADX INFO: renamed from: d5.d, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0681d {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final C0681d f11147a = new C0681d();

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    public static final Charset f11148b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    public static final Charset f11149c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    public static final Charset f11150d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    public static final Charset f11151e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public static final Charset f11152f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public static final Charset f11153g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    private static volatile Charset f11154h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    private static volatile Charset f11155i;

    static {
        Charset charsetForName = Charset.forName("UTF-8");
        l.e(charsetForName, "forName(...)");
        f11148b = charsetForName;
        Charset charsetForName2 = Charset.forName("UTF-16");
        l.e(charsetForName2, "forName(...)");
        f11149c = charsetForName2;
        Charset charsetForName3 = Charset.forName("UTF-16BE");
        l.e(charsetForName3, "forName(...)");
        f11150d = charsetForName3;
        Charset charsetForName4 = Charset.forName("UTF-16LE");
        l.e(charsetForName4, "forName(...)");
        f11151e = charsetForName4;
        Charset charsetForName5 = Charset.forName("US-ASCII");
        l.e(charsetForName5, "forName(...)");
        f11152f = charsetForName5;
        Charset charsetForName6 = Charset.forName("ISO-8859-1");
        l.e(charsetForName6, "forName(...)");
        f11153g = charsetForName6;
    }

    private C0681d() {
    }

    public final Charset a() {
        Charset charset = f11155i;
        if (charset != null) {
            return charset;
        }
        Charset charsetForName = Charset.forName("UTF-32BE");
        l.e(charsetForName, "forName(...)");
        f11155i = charsetForName;
        return charsetForName;
    }

    public final Charset b() {
        Charset charset = f11154h;
        if (charset != null) {
            return charset;
        }
        Charset charsetForName = Charset.forName("UTF-32LE");
        l.e(charsetForName, "forName(...)");
        f11154h = charsetForName;
        return charsetForName;
    }
}
