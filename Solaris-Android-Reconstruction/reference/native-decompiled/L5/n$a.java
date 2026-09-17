package L5;

import java.util.HashSet;
import p137u3.A;

/* JADX INFO: Access modifiers changed from: private */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class n$a {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final String f1841a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private int f1842b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private int f1843c;

    public n$a(String str) {
        J3.l.f(str, "s");
        this.f1841a = str;
    }

    public final Void a() {
        throw new IllegalArgumentException("RECOVERY_INVALID");
    }

    public final void b(String str) {
        J3.l.f(str, "t");
        if (p027d5.q.H(this.f1841a, str, this.f1842b, false, 4, null)) {
            this.f1842b += str.length();
        } else {
            a();
            throw new p137u3.e();
        }
    }

    public final void c() {
        f();
        e(0);
        f();
        if (this.f1842b == this.f1841a.length()) {
            return;
        }
        a();
        throw new p137u3.e();
    }

    public final String d() {
        if (this.f1842b < this.f1841a.length()) {
            String str = this.f1841a;
            int i6 = this.f1842b;
            this.f1842b = i6 + 1;
            if (str.charAt(i6) == '\"') {
                StringBuilder sb = new StringBuilder();
                while (this.f1842b < this.f1841a.length()) {
                    String str2 = this.f1841a;
                    int i7 = this.f1842b;
                    this.f1842b = i7 + 1;
                    char cCharAt = str2.charAt(i7);
                    if (cCharAt == '\"') {
                        String string = sb.toString();
                        J3.l.e(string, "toString(...)");
                        int i8 = 0;
                        while (i8 < string.length()) {
                            if (Character.isHighSurrogate(string.charAt(i8))) {
                                int i9 = i8 + 1;
                                if (i9 >= string.length() || !Character.isLowSurrogate(string.charAt(i9))) {
                                    a();
                                    throw new p137u3.e();
                                }
                                i8 += 2;
                            } else {
                                if (Character.isLowSurrogate(string.charAt(i8))) {
                                    a();
                                    throw new p137u3.e();
                                }
                                i8++;
                            }
                        }
                        return string;
                    }
                    if (J3.l.g(cCharAt, 32) < 0) {
                        a();
                        throw new p137u3.e();
                    }
                    if (cCharAt != '\\') {
                        sb.append(cCharAt);
                    } else {
                        if (this.f1842b >= this.f1841a.length()) {
                            a();
                            throw new p137u3.e();
                        }
                        String str3 = this.f1841a;
                        int i10 = this.f1842b;
                        this.f1842b = i10 + 1;
                        char cCharAt2 = str3.charAt(i10);
                        if (cCharAt2 != '\"' && cCharAt2 != '/' && cCharAt2 != '\\') {
                            if (cCharAt2 == 'b') {
                                cCharAt2 = '\b';
                            } else if (cCharAt2 == 'f') {
                                cCharAt2 = '\f';
                            } else if (cCharAt2 == 'n') {
                                cCharAt2 = '\n';
                            } else if (cCharAt2 == 'r') {
                                cCharAt2 = '\r';
                            } else if (cCharAt2 == 't') {
                                cCharAt2 = '\t';
                            } else {
                                if (cCharAt2 != 'u') {
                                    a();
                                    throw new p137u3.e();
                                }
                                if (this.f1842b + 4 > this.f1841a.length()) {
                                    a();
                                    throw new p137u3.e();
                                }
                                String str4 = this.f1841a;
                                int i11 = this.f1842b;
                                String strSubstring = str4.substring(i11, i11 + 4);
                                J3.l.e(strSubstring, "substring(...)");
                                Integer numO = p027d5.q.o(strSubstring, 16);
                                if (numO == null) {
                                    a();
                                    throw new p137u3.e();
                                }
                                sb.append((char) numO.intValue());
                                this.f1842b += 4;
                                A a6 = A.f16167a;
                            }
                        }
                        sb.append(cCharAt2);
                    }
                }
                a();
                throw new p137u3.e();
            }
        }
        a();
        throw new p137u3.e();
    }

    public final void e(int i6) {
        char cCharAt;
        char cCharAt2;
        f();
        if (i6 <= 32) {
            int i7 = this.f1843c + 1;
            this.f1843c = i7;
            if (i7 <= 500000 && this.f1842b < this.f1841a.length()) {
                char cCharAt3 = this.f1841a.charAt(this.f1842b);
                if (cCharAt3 == '\"') {
                    d();
                    return;
                }
                if (cCharAt3 == '[') {
                    this.f1842b++;
                    f();
                    if (this.f1842b < this.f1841a.length() && this.f1841a.charAt(this.f1842b) == ']') {
                        this.f1842b++;
                        return;
                    }
                    do {
                        e(i6 + 1);
                        f();
                        if (this.f1842b >= this.f1841a.length()) {
                            a();
                            throw new p137u3.e();
                        }
                        String str = this.f1841a;
                        int i8 = this.f1842b;
                        this.f1842b = i8 + 1;
                        cCharAt = str.charAt(i8);
                        if (cCharAt == ']') {
                            return;
                        }
                    } while (cCharAt == ',');
                    a();
                    throw new p137u3.e();
                }
                if (cCharAt3 == 'f') {
                    b("false");
                    return;
                }
                if (cCharAt3 == 'n') {
                    b("null");
                    return;
                }
                if (cCharAt3 == 't') {
                    b("true");
                    return;
                }
                if (cCharAt3 != '{') {
                    p027d5.l lVarB = new p027d5.o("-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?").b(this.f1841a, this.f1842b);
                    if (lVarB == null) {
                        a();
                        throw new p137u3.e();
                    }
                    if (lVarB.c().d() == this.f1842b) {
                        this.f1842b = lVarB.c().f() + 1;
                        return;
                    } else {
                        a();
                        throw new p137u3.e();
                    }
                }
                this.f1842b++;
                f();
                HashSet hashSet = new HashSet();
                if (this.f1842b < this.f1841a.length() && this.f1841a.charAt(this.f1842b) == '}') {
                    this.f1842b++;
                    return;
                }
                do {
                    f();
                    if (!hashSet.add(d())) {
                        a();
                        throw new p137u3.e();
                    }
                    f();
                    if (this.f1842b < this.f1841a.length()) {
                        String str2 = this.f1841a;
                        int i9 = this.f1842b;
                        this.f1842b = i9 + 1;
                        if (str2.charAt(i9) == ':') {
                            e(i6 + 1);
                            f();
                            if (this.f1842b >= this.f1841a.length()) {
                                a();
                                throw new p137u3.e();
                            }
                            String str3 = this.f1841a;
                            int i10 = this.f1842b;
                            this.f1842b = i10 + 1;
                            cCharAt2 = str3.charAt(i10);
                            if (cCharAt2 == '}') {
                                return;
                            }
                        }
                    }
                    a();
                    throw new p137u3.e();
                } while (cCharAt2 == ',');
                a();
                throw new p137u3.e();
            }
        }
        a();
        throw new p137u3.e();
    }

    public final void f() {
        while (this.f1842b < this.f1841a.length() && p027d5.q.N(" \r\n\t", this.f1841a.charAt(this.f1842b), false, 2, null)) {
            this.f1842b++;
        }
    }
}
