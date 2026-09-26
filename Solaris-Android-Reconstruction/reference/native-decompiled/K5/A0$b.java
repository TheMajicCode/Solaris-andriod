package K5;

import java.io.File;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class A0$b {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final long f1485a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final int f1486b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final long f1487c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    private final int f1488d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    private final File f1489e;

    public A0$b(long j6, int i6, long j7, int i7, File file) {
        J3.l.f(file, "file");
        this.f1485a = j6;
        this.f1486b = i6;
        this.f1487c = j7;
        this.f1488d = i7;
        this.f1489e = file;
    }

    public final File a() {
        return this.f1489e;
    }

    public final long b() {
        return this.f1485a;
    }

    public final int c() {
        return this.f1488d;
    }

    public final long d() {
        return this.f1487c;
    }

    public final int e() {
        return this.f1486b;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof A0$b)) {
            return false;
        }
        A0$b a0$b = (A0$b) obj;
        return this.f1485a == a0$b.f1485a && this.f1486b == a0$b.f1486b && this.f1487c == a0$b.f1487c && this.f1488d == a0$b.f1488d && J3.l.b(this.f1489e, a0$b.f1489e);
    }

    public int hashCode() {
        return (((((((Long.hashCode(this.f1485a) * 31) + Integer.hashCode(this.f1486b)) * 31) + Long.hashCode(this.f1487c)) * 31) + Integer.hashCode(this.f1488d)) * 31) + this.f1489e.hashCode();
    }

    public String toString() {
        return "Job(id=" + this.f1485a + ", status=" + this.f1486b + ", received=" + this.f1487c + ", reason=" + this.f1488d + ", file=" + this.f1489e + ")";
    }
}
