package K5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class y0$a {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final String f1693a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final String f1694b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final String f1695c;

    public y0$a(String str, String str2, String str3) {
        J3.l.f(str, "state");
        J3.l.f(str2, "locale");
        this.f1693a = str;
        this.f1694b = str2;
        this.f1695c = str3;
    }

    public final String a() {
        return this.f1694b;
    }

    public final String b() {
        return this.f1695c;
    }

    public final String c() {
        return this.f1693a;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof y0$a)) {
            return false;
        }
        y0$a y0_a = (y0$a) obj;
        return J3.l.b(this.f1693a, y0_a.f1693a) && J3.l.b(this.f1694b, y0_a.f1694b) && J3.l.b(this.f1695c, y0_a.f1695c);
    }

    public int hashCode() {
        int iHashCode = ((this.f1693a.hashCode() * 31) + this.f1694b.hashCode()) * 31;
        String str = this.f1695c;
        return iHashCode + (str == null ? 0 : str.hashCode());
    }

    public String toString() {
        return "Resource(state=" + this.f1693a + ", locale=" + this.f1694b + ", reason=" + this.f1695c + ")";
    }
}
