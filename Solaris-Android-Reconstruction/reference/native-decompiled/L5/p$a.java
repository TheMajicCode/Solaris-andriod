package L5;

import android.os.CancellationSignal;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.atomic.AtomicBoolean;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class p$a {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final AtomicBoolean f1846a = new AtomicBoolean(false);

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final CancellationSignal f1847b = new CancellationSignal();

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private volatile InputStream f1848c;

    public final void a(InputStream inputStream) throws IOException {
        J3.l.f(inputStream, "stream");
        this.f1848c = inputStream;
        if (this.f1846a.get()) {
            inputStream.close();
            throw new IllegalStateException("CANCELLED");
        }
    }

    public final void b() {
        this.f1846a.set(true);
        this.f1847b.cancel();
        try {
            InputStream inputStream = this.f1848c;
            if (inputStream != null) {
                inputStream.close();
            }
        } catch (Exception unused) {
        }
    }

    public final void c() {
        if (this.f1846a.get()) {
            throw new IllegalStateException("CANCELLED");
        }
    }

    public final CancellationSignal d() {
        return this.f1847b;
    }

    public final void e() {
        try {
            InputStream inputStream = this.f1848c;
            if (inputStream != null) {
                inputStream.close();
            }
        } catch (Exception unused) {
        }
        this.f1848c = null;
    }
}
