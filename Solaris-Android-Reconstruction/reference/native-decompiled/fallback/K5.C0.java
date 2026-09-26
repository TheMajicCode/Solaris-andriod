package K5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0 {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final K5.C0 f1490a = null;

    static {
            K5.C0 r0 = new K5.C0
            r0.<init>()
            K5.C0.f1490a = r0
            return
    }

    private C0() {
            r0 = this;
            r0.<init>()
            return
    }

    public static /* synthetic */ java.lang.CharSequence a(byte r0) {
            java.lang.CharSequence r0 = c(r0)
            return r0
    }

    private static final java.lang.CharSequence c(byte r1) {
            java.lang.Byte r1 = java.lang.Byte.valueOf(r1)
            java.lang.Object[] r1 = new java.lang.Object[]{r1}
            r0 = 1
            java.lang.Object[] r1 = java.util.Arrays.copyOf(r1, r0)
            java.lang.String r0 = "%02x"
            java.lang.String r1 = java.lang.String.format(r0, r1)
            java.lang.String r0 = "format(...)"
            J3.l.e(r1, r0)
            return r1
    }

    public final void b(java.io.File r27, java.io.File r28, long r29, java.lang.String r31, java.util.concurrent.atomic.AtomicBoolean r32, kotlin.jvm.functions.Function1 r33) {
            r26 = this;
            r0 = r27
            r1 = r28
            r2 = r31
            r3 = r33
            java.lang.String r4 = "source"
            J3.l.f(r0, r4)
            java.lang.String r4 = "expected"
            J3.l.f(r2, r4)
            java.lang.String r4 = "cancelled"
            r5 = r32
            J3.l.f(r5, r4)
            java.lang.String r4 = "progress"
            J3.l.f(r3, r4)
            boolean r4 = r0.isFile()
            java.lang.String r6 = "MODEL_SIZE_MISMATCH"
            if (r4 == 0) goto L125
            long r7 = r0.length()
            int r4 = (r7 > r29 ? 1 : (r7 == r29 ? 0 : -1))
            if (r4 != 0) goto L125
            java.lang.String r4 = "SHA-256"
            java.security.MessageDigest r4 = java.security.MessageDigest.getInstance(r4)
            if (r1 == 0) goto L3c
            java.io.FileOutputStream r8 = new java.io.FileOutputStream
            r8.<init>(r1)
            goto L3d
        L3c:
            r8 = 0
        L3d:
            java.io.FileInputStream r9 = new java.io.FileInputStream     // Catch: java.lang.Throwable -> L117
            r9.<init>(r0)     // Catch: java.lang.Throwable -> L117
            r0 = 262144(0x40000, float:3.67342E-40)
            java.io.BufferedInputStream r10 = new java.io.BufferedInputStream     // Catch: java.lang.Throwable -> L117
            r10.<init>(r9, r0)     // Catch: java.lang.Throwable -> L117
            byte[] r0 = new byte[r0]     // Catch: java.lang.Throwable -> L105
            r11 = 0
            r13 = r11
        L4e:
            boolean r9 = r5.get()     // Catch: java.lang.Throwable -> L105
            java.lang.String r15 = "CANCELLED"
            if (r9 != 0) goto L109
            int r9 = r10.read(r0)     // Catch: java.lang.Throwable -> L105
            if (r9 < 0) goto La1
            r16 = r8
            long r7 = (long) r9
            long r11 = r11 + r7
            int r7 = (r11 > r29 ? 1 : (r11 == r29 ? 0 : -1))
            if (r7 > 0) goto L99
            r8 = 0
            r4.update(r0, r8, r9)     // Catch: java.lang.Throwable -> L93
            if (r16 == 0) goto L76
            r15 = r16
            r15.write(r0, r8, r9)     // Catch: java.lang.Throwable -> L70
            goto L78
        L70:
            r0 = move-exception
            r2 = r0
            r16 = r15
            goto L111
        L76:
            r15 = r16
        L78:
            long r8 = java.lang.System.nanoTime()     // Catch: java.lang.Throwable -> L70
            long r16 = r8 - r13
            r18 = 150000000(0x8f0d180, double:7.4109847E-316)
            int r16 = (r16 > r18 ? 1 : (r16 == r18 ? 0 : -1))
            if (r16 > 0) goto L8a
            if (r7 != 0) goto L88
            goto L8a
        L88:
            r8 = r15
            goto L4e
        L8a:
            java.lang.Long r7 = java.lang.Long.valueOf(r11)     // Catch: java.lang.Throwable -> L70
            r3.q(r7)     // Catch: java.lang.Throwable -> L70
            r13 = r8
            goto L88
        L93:
            r0 = move-exception
            r15 = r16
        L96:
            r2 = r0
            goto L111
        L99:
            r15 = r16
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L70
            r0.<init>(r6)     // Catch: java.lang.Throwable -> L70
            throw r0     // Catch: java.lang.Throwable -> L70
        La1:
            r16 = r8
            u3.A r0 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> L103
            r0 = 0
            F3.c.a(r10, r0)     // Catch: java.lang.Throwable -> Le7
            int r0 = (r11 > r29 ? 1 : (r11 == r29 ? 0 : -1))
            if (r0 != 0) goto Lfd
            byte[] r0 = r4.digest()     // Catch: java.lang.Throwable -> Le7
            java.lang.String r3 = "digest(...)"
            J3.l.e(r0, r3)     // Catch: java.lang.Throwable -> Le7
            java.lang.String r18 = ""
            K5.B0 r23 = new K5.B0     // Catch: java.lang.Throwable -> Le7
            r23.<init>()     // Catch: java.lang.Throwable -> Le7
            r24 = 30
            r25 = 0
            r19 = 0
            r20 = 0
            r21 = 0
            r22 = 0
            r17 = r0
            java.lang.String r0 = p143v3.AbstractC1209j.Z(r17, r18, r19, r20, r21, r22, r23, r24, r25)     // Catch: java.lang.Throwable -> Le7
            boolean r0 = J3.l.b(r0, r2)     // Catch: java.lang.Throwable -> Le7
            if (r0 == 0) goto Lf5
            boolean r0 = r5.get()     // Catch: java.lang.Throwable -> Le7
            if (r0 != 0) goto Lef
            if (r16 == 0) goto Le9
            java.io.FileDescriptor r0 = r16.getFD()     // Catch: java.lang.Throwable -> Le7
            if (r0 == 0) goto Le9
            r0.sync()     // Catch: java.lang.Throwable -> Le7
            goto Le9
        Le7:
            r0 = move-exception
            goto L11a
        Le9:
            if (r16 == 0) goto Lee
            r16.close()
        Lee:
            return
        Lef:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> Le7
            r0.<init>(r15)     // Catch: java.lang.Throwable -> Le7
            throw r0     // Catch: java.lang.Throwable -> Le7
        Lf5:
            java.lang.String r0 = "MODEL_INTEGRITY_FAILED"
            java.lang.IllegalStateException r2 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> Le7
            r2.<init>(r0)     // Catch: java.lang.Throwable -> Le7
            throw r2     // Catch: java.lang.Throwable -> Le7
        Lfd:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> Le7
            r0.<init>(r6)     // Catch: java.lang.Throwable -> Le7
            throw r0     // Catch: java.lang.Throwable -> Le7
        L103:
            r0 = move-exception
            goto L96
        L105:
            r0 = move-exception
            r16 = r8
            goto L96
        L109:
            r16 = r8
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L103
            r0.<init>(r15)     // Catch: java.lang.Throwable -> L103
            throw r0     // Catch: java.lang.Throwable -> L103
        L111:
            throw r2     // Catch: java.lang.Throwable -> L112
        L112:
            r0 = move-exception
            F3.c.a(r10, r2)     // Catch: java.lang.Throwable -> Le7
            throw r0     // Catch: java.lang.Throwable -> Le7
        L117:
            r0 = move-exception
            r16 = r8
        L11a:
            if (r16 == 0) goto L11f
            r16.close()
        L11f:
            if (r1 == 0) goto L124
            r1.delete()
        L124:
            throw r0
        L125:
            java.lang.IllegalArgumentException r0 = new java.lang.IllegalArgumentException
            r0.<init>(r6)
            throw r0
    }
}
