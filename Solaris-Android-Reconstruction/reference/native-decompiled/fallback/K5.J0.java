package K5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class J0 {

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public static final K5.J0.a f1491h = null;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    private static K5.J0 f1492i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    private static final java.util.Set f1493j = null;

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    private static final java.util.Set f1494k = null;

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final android.content.Context f1495a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final android.content.SharedPreferences f1496b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final java.lang.String f1497c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    private final java.lang.String f1498d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    private final kotlin.Pair f1499e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    private final java.lang.Integer f1500f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    private boolean f1501g;

    public static final class a {
        private a() {
                r0 = this;
                r0.<init>()
                return
        }

        public /* synthetic */ a(kotlin.jvm.internal.DefaultConstructorMarker r1) {
                r0 = this;
                r0.<init>()
                return
        }

        public final synchronized K5.J0 a(android.content.Context r3) {
                r2 = this;
                monitor-enter(r2)
                java.lang.String r0 = "context"
                J3.l.f(r3, r0)     // Catch: java.lang.Throwable -> L1f
                K5.J0 r0 = K5.J0.a()     // Catch: java.lang.Throwable -> L1f
                if (r0 != 0) goto L21
                K5.J0 r0 = new K5.J0     // Catch: java.lang.Throwable -> L1f
                android.content.Context r3 = r3.getApplicationContext()     // Catch: java.lang.Throwable -> L1f
                java.lang.String r1 = "getApplicationContext(...)"
                J3.l.e(r3, r1)     // Catch: java.lang.Throwable -> L1f
                r1 = 0
                r0.<init>(r3, r1)     // Catch: java.lang.Throwable -> L1f
                K5.J0.b(r0)     // Catch: java.lang.Throwable -> L1f
                goto L21
            L1f:
                r3 = move-exception
                goto L23
            L21:
                monitor-exit(r2)
                return r0
            L23:
                monitor-exit(r2)     // Catch: java.lang.Throwable -> L1f
                throw r3
        }

        public final boolean b(boolean r1, boolean r2, java.lang.Integer r3) {
                r0 = this;
                if (r2 == 0) goto L24
                if (r1 != 0) goto L22
                if (r3 != 0) goto L7
                goto Le
            L7:
                int r0 = r3.intValue()
                r1 = 4
                if (r0 == r1) goto L22
            Le:
                if (r3 != 0) goto L11
                goto L18
            L11:
                int r0 = r3.intValue()
                r1 = 5
                if (r0 == r1) goto L22
            L18:
                if (r3 != 0) goto L1b
                goto L24
            L1b:
                int r0 = r3.intValue()
                r1 = 6
                if (r0 != r1) goto L24
            L22:
                r0 = 1
                return r0
            L24:
                r0 = 0
                return r0
        }

        public final java.lang.String c(java.lang.Integer r2) {
                r1 = this;
                if (r2 != 0) goto L3
                goto Ld
            L3:
                int r1 = r2.intValue()
                r0 = 3
                if (r1 != r0) goto Ld
                java.lang.String r1 = "LOW_MEMORY"
                return r1
            Ld:
                if (r2 != 0) goto L10
                goto L1a
            L10:
                int r1 = r2.intValue()
                r0 = 4
                if (r1 != r0) goto L1a
                java.lang.String r1 = "JAVA_CRASH"
                return r1
            L1a:
                if (r2 != 0) goto L1d
                goto L27
            L1d:
                int r1 = r2.intValue()
                r0 = 5
                if (r1 != r0) goto L27
                java.lang.String r1 = "NATIVE_CRASH"
                return r1
            L27:
                if (r2 != 0) goto L2a
                goto L34
            L2a:
                int r1 = r2.intValue()
                r0 = 6
                if (r1 != r0) goto L34
                java.lang.String r1 = "ANR"
                return r1
            L34:
                if (r2 != 0) goto L37
                goto L42
            L37:
                int r1 = r2.intValue()
                r0 = 10
                if (r1 != r0) goto L42
                java.lang.String r1 = "USER_REQUESTED"
                return r1
            L42:
                if (r2 != 0) goto L47
                java.lang.String r1 = "UNKNOWN"
                return r1
            L47:
                java.lang.String r1 = "OTHER_EXIT"
                return r1
        }
    }

    static {
            K5.J0$a r0 = new K5.J0$a
            r1 = 0
            r0.<init>(r1)
            K5.J0.f1491h = r0
            java.lang.String r11 = "unload"
            java.lang.String r12 = "idle"
            java.lang.String r2 = "bare-init"
            java.lang.String r3 = "bare-start"
            java.lang.String r4 = "bare-echo"
            java.lang.String r5 = "sdk-bootstrap"
            java.lang.String r6 = "sdk-heartbeat"
            java.lang.String r7 = "model-load"
            java.lang.String r8 = "model-ready"
            java.lang.String r9 = "stream"
            java.lang.String r10 = "stream-complete"
            java.lang.String[] r0 = new java.lang.String[]{r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12}
            java.util.Set r0 = p143v3.U.h(r0)
            K5.J0.f1493j = r0
            java.lang.String r6 = "stream"
            java.lang.String r7 = "unload"
            java.lang.String r1 = "bare-init"
            java.lang.String r2 = "bare-start"
            java.lang.String r3 = "sdk-bootstrap"
            java.lang.String r4 = "sdk-heartbeat"
            java.lang.String r5 = "model-load"
            java.lang.String[] r0 = new java.lang.String[]{r1, r2, r3, r4, r5, r6, r7}
            java.util.Set r0 = p143v3.U.h(r0)
            K5.J0.f1494k = r0
            return
    }

    private J0(android.content.Context r10) {
            r9 = this;
            r9.<init>()
            r9.f1495a = r10
            java.lang.String r0 = "solaris-runtime-recovery-v2"
            r1 = 0
            android.content.SharedPreferences r0 = r10.getSharedPreferences(r0, r1)
            r9.f1496b = r0
            java.util.UUID r2 = java.util.UUID.randomUUID()
            java.lang.String r2 = r2.toString()
            java.lang.String r3 = "toString(...)"
            J3.l.e(r2, r3)
            r9.f1497c = r2
            java.lang.String r2 = "phase"
            r3 = 0
            java.lang.String r0 = r0.getString(r2, r3)
            if (r0 == 0) goto L2f
            java.util.Set r2 = K5.J0.f1493j
            boolean r2 = r2.contains(r0)
            if (r2 == 0) goto L2f
            goto L30
        L2f:
            r0 = r3
        L30:
            r9.f1498d = r0
            int r0 = android.os.Build.VERSION.SDK_INT
            r2 = 30
            if (r0 < r2) goto Lc3
            u3.n$a r0 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L8b
            java.lang.String r0 = "activity"
            java.lang.Object r0 = r10.getSystemService(r0)     // Catch: java.lang.Throwable -> L8b
            java.lang.String r2 = "null cannot be cast to non-null type android.app.ActivityManager"
            J3.l.d(r0, r2)     // Catch: java.lang.Throwable -> L8b
            android.app.ActivityManager r0 = (android.app.ActivityManager) r0     // Catch: java.lang.Throwable -> L8b
            java.lang.String r10 = r10.getPackageName()     // Catch: java.lang.Throwable -> L8b
            r2 = 8
            java.util.List r10 = K5.D0.a(r0, r10, r1, r2)     // Catch: java.lang.Throwable -> L8b
            java.lang.String r0 = "getHistoricalProcessExitReasons(...)"
            J3.l.e(r10, r0)     // Catch: java.lang.Throwable -> L8b
            java.util.Iterator r10 = r10.iterator()     // Catch: java.lang.Throwable -> L8b
        L5a:
            boolean r0 = r10.hasNext()     // Catch: java.lang.Throwable -> L8b
            if (r0 == 0) goto L8d
            java.lang.Object r0 = r10.next()     // Catch: java.lang.Throwable -> L8b
            android.app.ApplicationExitInfo r2 = K5.E0.a(r0)     // Catch: java.lang.Throwable -> L8b
            java.lang.String r4 = K5.F0.a(r2)     // Catch: java.lang.Throwable -> L8b
            android.content.Context r5 = r9.f1495a     // Catch: java.lang.Throwable -> L8b
            java.lang.String r5 = r5.getPackageName()     // Catch: java.lang.Throwable -> L8b
            boolean r4 = J3.l.b(r4, r5)     // Catch: java.lang.Throwable -> L8b
            if (r4 == 0) goto L5a
            long r4 = K5.G0.a(r2)     // Catch: java.lang.Throwable -> L8b
            android.content.SharedPreferences r2 = r9.f1496b     // Catch: java.lang.Throwable -> L8b
            java.lang.String r6 = "armedAt"
            r7 = 0
            long r6 = r2.getLong(r6, r7)     // Catch: java.lang.Throwable -> L8b
            int r2 = (r4 > r6 ? 1 : (r4 == r6 ? 0 : -1))
            if (r2 < 0) goto L5a
            goto L8e
        L8b:
            r10 = move-exception
            goto Laf
        L8d:
            r0 = r3
        L8e:
            android.app.ApplicationExitInfo r10 = K5.E0.a(r0)     // Catch: java.lang.Throwable -> L8b
            if (r10 == 0) goto La9
            int r0 = K5.H0.a(r10)     // Catch: java.lang.Throwable -> L8b
            java.lang.Integer r0 = java.lang.Integer.valueOf(r0)     // Catch: java.lang.Throwable -> L8b
            int r10 = K5.I0.a(r10)     // Catch: java.lang.Throwable -> L8b
            java.lang.Integer r10 = java.lang.Integer.valueOf(r10)     // Catch: java.lang.Throwable -> L8b
            kotlin.Pair r10 = p137u3.s.a(r0, r10)     // Catch: java.lang.Throwable -> L8b
            goto Laa
        La9:
            r10 = r3
        Laa:
            java.lang.Object r10 = p137u3.n.a(r10)     // Catch: java.lang.Throwable -> L8b
            goto Lb9
        Laf:
            u3.n$a r0 = p137u3.n.f16184f
            java.lang.Object r10 = p137u3.o.a(r10)
            java.lang.Object r10 = p137u3.n.a(r10)
        Lb9:
            boolean r0 = p137u3.n.c(r10)
            if (r0 == 0) goto Lc0
            r10 = r3
        Lc0:
            kotlin.Pair r10 = (kotlin.Pair) r10
            goto Lc4
        Lc3:
            r10 = r3
        Lc4:
            r9.f1499e = r10
            if (r10 == 0) goto Lcf
            java.lang.Object r10 = r10.c()
            r3 = r10
            java.lang.Integer r3 = (java.lang.Integer) r3
        Lcf:
            r9.f1500f = r3
            android.content.SharedPreferences r10 = r9.f1496b
            java.lang.String r0 = "blocked"
            boolean r10 = r10.getBoolean(r0, r1)
            r2 = 1
            if (r10 != 0) goto Lf3
            K5.J0$a r10 = K5.J0.f1491h
            android.content.SharedPreferences r4 = r9.f1496b
            java.lang.String r5 = "armed"
            boolean r4 = r4.getBoolean(r5, r1)
            java.lang.String r5 = r9.f1498d
            if (r5 == 0) goto Lec
            r5 = r2
            goto Led
        Lec:
            r5 = r1
        Led:
            boolean r10 = r10.b(r4, r5, r3)
            if (r10 == 0) goto Lf4
        Lf3:
            r1 = r2
        Lf4:
            r9.f1501g = r1
            android.content.SharedPreferences r10 = r9.f1496b
            android.content.SharedPreferences$Editor r10 = r10.edit()
            boolean r9 = r9.f1501g
            android.content.SharedPreferences$Editor r9 = r10.putBoolean(r0, r9)
            boolean r9 = r9.commit()
            if (r9 == 0) goto L109
            return
        L109:
            java.lang.IllegalStateException r9 = new java.lang.IllegalStateException
            java.lang.String r10 = "RECOVERY_STATE_FAILED"
            r9.<init>(r10)
            throw r9
    }

    public /* synthetic */ J0(android.content.Context r1, kotlin.jvm.internal.DefaultConstructorMarker r2) {
            r0 = this;
            r0.<init>(r1)
            return
    }

    public static final /* synthetic */ K5.J0 a() {
            K5.J0 r0 = K5.J0.f1492i
            return r0
    }

    public static final /* synthetic */ void b(K5.J0 r0) {
            K5.J0.f1492i = r0
            return
    }

    public final synchronized void c() {
            r3 = this;
            monitor-enter(r3)
            r0 = 0
            r3.f1501g = r0     // Catch: java.lang.Throwable -> L2c
            android.content.SharedPreferences r1 = r3.f1496b     // Catch: java.lang.Throwable -> L2c
            android.content.SharedPreferences$Editor r1 = r1.edit()     // Catch: java.lang.Throwable -> L2c
            java.lang.String r2 = "blocked"
            android.content.SharedPreferences$Editor r1 = r1.putBoolean(r2, r0)     // Catch: java.lang.Throwable -> L2c
            java.lang.String r2 = "armed"
            android.content.SharedPreferences$Editor r0 = r1.putBoolean(r2, r0)     // Catch: java.lang.Throwable -> L2c
            java.lang.String r1 = "phase"
            android.content.SharedPreferences$Editor r0 = r0.remove(r1)     // Catch: java.lang.Throwable -> L2c
            boolean r0 = r0.commit()     // Catch: java.lang.Throwable -> L2c
            if (r0 == 0) goto L24
            monitor-exit(r3)
            return
        L24:
            java.lang.String r0 = "RECOVERY_STATE_FAILED"
            java.lang.IllegalStateException r1 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L2c
            r1.<init>(r0)     // Catch: java.lang.Throwable -> L2c
            throw r1     // Catch: java.lang.Throwable -> L2c
        L2c:
            r0 = move-exception
            monitor-exit(r3)     // Catch: java.lang.Throwable -> L2c
            throw r0
    }

    public final synchronized void d(java.lang.String r5) {
            r4 = this;
            monitor-enter(r4)
            java.lang.String r0 = "phase"
            J3.l.f(r5, r0)     // Catch: java.lang.Throwable -> L45
            java.util.Set r0 = K5.J0.f1493j     // Catch: java.lang.Throwable -> L45
            boolean r0 = r0.contains(r5)     // Catch: java.lang.Throwable -> L45
            if (r0 == 0) goto L5f
            boolean r0 = r4.f1501g     // Catch: java.lang.Throwable -> L45
            if (r0 != 0) goto L57
            android.content.SharedPreferences r0 = r4.f1496b     // Catch: java.lang.Throwable -> L45
            android.content.SharedPreferences$Editor r0 = r0.edit()     // Catch: java.lang.Throwable -> L45
            java.lang.String r1 = "phase"
            android.content.SharedPreferences$Editor r0 = r0.putString(r1, r5)     // Catch: java.lang.Throwable -> L45
            java.lang.String r1 = "armed"
            java.util.Set r2 = K5.J0.f1494k     // Catch: java.lang.Throwable -> L45
            boolean r3 = r2.contains(r5)     // Catch: java.lang.Throwable -> L45
            android.content.SharedPreferences$Editor r0 = r0.putBoolean(r1, r3)     // Catch: java.lang.Throwable -> L45
            boolean r5 = r2.contains(r5)     // Catch: java.lang.Throwable -> L45
            if (r5 == 0) goto L47
            android.content.SharedPreferences r5 = r4.f1496b     // Catch: java.lang.Throwable -> L45
            java.lang.String r1 = "armed"
            r2 = 0
            boolean r5 = r5.getBoolean(r1, r2)     // Catch: java.lang.Throwable -> L45
            if (r5 != 0) goto L47
            java.lang.String r5 = "armedAt"
            long r1 = java.lang.System.currentTimeMillis()     // Catch: java.lang.Throwable -> L45
            r0.putLong(r5, r1)     // Catch: java.lang.Throwable -> L45
            goto L47
        L45:
            r5 = move-exception
            goto L67
        L47:
            boolean r5 = r0.commit()     // Catch: java.lang.Throwable -> L45
            if (r5 == 0) goto L4f
            monitor-exit(r4)
            return
        L4f:
            java.lang.String r5 = "RECOVERY_STATE_FAILED"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L45
            r0.<init>(r5)     // Catch: java.lang.Throwable -> L45
            throw r0     // Catch: java.lang.Throwable -> L45
        L57:
            java.lang.String r5 = "WORKER_RECOVERY_REQUIRED"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L45
            r0.<init>(r5)     // Catch: java.lang.Throwable -> L45
            throw r0     // Catch: java.lang.Throwable -> L45
        L5f:
            java.lang.String r5 = "STAGE_INVALID"
            java.lang.IllegalArgumentException r0 = new java.lang.IllegalArgumentException     // Catch: java.lang.Throwable -> L45
            r0.<init>(r5)     // Catch: java.lang.Throwable -> L45
            throw r0     // Catch: java.lang.Throwable -> L45
        L67:
            monitor-exit(r4)     // Catch: java.lang.Throwable -> L45
            throw r5
    }

    public final synchronized java.util.Map e() {
            r14 = this;
            monitor-enter(r14)
            java.lang.String r0 = "runId"
            java.lang.String r1 = r14.f1497c     // Catch: java.lang.Throwable -> L2d
            kotlin.Pair r2 = p137u3.s.a(r0, r1)     // Catch: java.lang.Throwable -> L2d
            java.lang.String r0 = "previousStage"
            java.lang.String r1 = r14.f1498d     // Catch: java.lang.Throwable -> L2d
            kotlin.Pair r3 = p137u3.s.a(r0, r1)     // Catch: java.lang.Throwable -> L2d
            java.lang.String r0 = "exitReason"
            K5.J0$a r1 = K5.J0.f1491h     // Catch: java.lang.Throwable -> L2d
            java.lang.Integer r4 = r14.f1500f     // Catch: java.lang.Throwable -> L2d
            java.lang.String r1 = r1.c(r4)     // Catch: java.lang.Throwable -> L2d
            kotlin.Pair r4 = p137u3.s.a(r0, r1)     // Catch: java.lang.Throwable -> L2d
            java.lang.String r0 = "exitStatus"
            kotlin.Pair r1 = r14.f1499e     // Catch: java.lang.Throwable -> L2d
            r5 = 0
            if (r1 == 0) goto L2f
            java.lang.Object r1 = r1.d()     // Catch: java.lang.Throwable -> L2d
            java.lang.Integer r1 = (java.lang.Integer) r1     // Catch: java.lang.Throwable -> L2d
            goto L30
        L2d:
            r0 = move-exception
            goto L82
        L2f:
            r1 = r5
        L30:
            kotlin.Pair r0 = p137u3.s.a(r0, r1)     // Catch: java.lang.Throwable -> L2d
            java.lang.String r1 = "exitReasonAvailable"
            int r6 = android.os.Build.VERSION.SDK_INT     // Catch: java.lang.Throwable -> L2d
            r7 = 0
            r8 = 1
            r9 = 30
            if (r6 < r9) goto L44
            java.lang.Integer r10 = r14.f1500f     // Catch: java.lang.Throwable -> L2d
            if (r10 == 0) goto L44
            r10 = r8
            goto L45
        L44:
            r10 = r7
        L45:
            java.lang.Boolean r10 = java.lang.Boolean.valueOf(r10)     // Catch: java.lang.Throwable -> L2d
            kotlin.Pair r1 = p137u3.s.a(r1, r10)     // Catch: java.lang.Throwable -> L2d
            java.lang.String r10 = "blocked"
            boolean r11 = r14.f1501g     // Catch: java.lang.Throwable -> L2d
            java.lang.Boolean r11 = java.lang.Boolean.valueOf(r11)     // Catch: java.lang.Throwable -> L2d
            kotlin.Pair r10 = p137u3.s.a(r10, r11)     // Catch: java.lang.Throwable -> L2d
            java.lang.String r11 = "currentStage"
            android.content.SharedPreferences r12 = r14.f1496b     // Catch: java.lang.Throwable -> L2d
            java.lang.String r13 = "phase"
            java.lang.String r5 = r12.getString(r13, r5)     // Catch: java.lang.Throwable -> L2d
            kotlin.Pair r5 = p137u3.s.a(r11, r5)     // Catch: java.lang.Throwable -> L2d
            java.lang.String r11 = "apiSupported"
            if (r6 < r9) goto L6c
            r7 = r8
        L6c:
            java.lang.Boolean r6 = java.lang.Boolean.valueOf(r7)     // Catch: java.lang.Throwable -> L2d
            kotlin.Pair r9 = p137u3.s.a(r11, r6)     // Catch: java.lang.Throwable -> L2d
            r6 = r1
            r8 = r5
            r7 = r10
            r5 = r0
            kotlin.Pair[] r0 = new kotlin.Pair[]{r2, r3, r4, r5, r6, r7, r8, r9}     // Catch: java.lang.Throwable -> L2d
            java.util.Map r0 = p143v3.L.l(r0)     // Catch: java.lang.Throwable -> L2d
            monitor-exit(r14)
            return r0
        L82:
            monitor-exit(r14)     // Catch: java.lang.Throwable -> L2d
            throw r0
    }
}
