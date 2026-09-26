package K5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class A0 {

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    public static final K5.A0.a f1473k = null;

    /* JADX INFO: renamed from: l, reason: collision with root package name */
    private static K5.A0 f1474l;

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final android.content.Context f1475a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final android.content.SharedPreferences f1476b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final java.io.File f1477c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    private final java.io.File f1478d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    private final java.io.File f1479e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    private final java.util.concurrent.atomic.AtomicBoolean f1480f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    private volatile boolean f1481g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    private volatile boolean f1482h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    private volatile long f1483i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    private volatile java.lang.String f1484j;

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

        public final boolean a(int r2) {
                r1 = this;
                r1 = 1
                if (r2 == r1) goto Lb
                r0 = 2
                if (r2 == r0) goto Lb
                r0 = 4
                if (r2 != r0) goto La
                goto Lb
            La:
                r1 = 0
            Lb:
                return r1
        }

        public final synchronized K5.A0 b(android.content.Context r3) {
                r2 = this;
                monitor-enter(r2)
                java.lang.String r0 = "context"
                J3.l.f(r3, r0)     // Catch: java.lang.Throwable -> L1f
                K5.A0 r0 = K5.A0.b()     // Catch: java.lang.Throwable -> L1f
                if (r0 != 0) goto L21
                K5.A0 r0 = new K5.A0     // Catch: java.lang.Throwable -> L1f
                android.content.Context r3 = r3.getApplicationContext()     // Catch: java.lang.Throwable -> L1f
                java.lang.String r1 = "getApplicationContext(...)"
                J3.l.e(r3, r1)     // Catch: java.lang.Throwable -> L1f
                r1 = 0
                r0.<init>(r3, r1)     // Catch: java.lang.Throwable -> L1f
                K5.A0.c(r0)     // Catch: java.lang.Throwable -> L1f
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

        public final java.lang.String c(int r1) {
                r0 = this;
                r0 = 1
                if (r1 != r0) goto L6
                java.lang.String r0 = "WAITING_TO_RETRY"
                return r0
            L6:
                r0 = 2
                if (r1 != r0) goto Lc
                java.lang.String r0 = "WAITING_FOR_NETWORK"
                return r0
            Lc:
                r0 = 3
                if (r1 != r0) goto L12
                java.lang.String r0 = "WAITING_FOR_WIFI"
                return r0
            L12:
                r0 = 4
                if (r1 != r0) goto L18
                java.lang.String r0 = "WAITING"
                return r0
            L18:
                r0 = 1006(0x3ee, float:1.41E-42)
                if (r1 != r0) goto L1f
                java.lang.String r0 = "INSUFFICIENT_SPACE"
                return r0
            L1f:
                r0 = 1007(0x3ef, float:1.411E-42)
                if (r1 != r0) goto L26
                java.lang.String r0 = "STORAGE_UNAVAILABLE"
                return r0
            L26:
                r0 = 1008(0x3f0, float:1.413E-42)
                if (r1 != r0) goto L2d
                java.lang.String r0 = "DOWNLOAD_CANNOT_RESUME"
                return r0
            L2d:
                r0 = 1009(0x3f1, float:1.414E-42)
                if (r1 != r0) goto L34
                java.lang.String r0 = "FILE_ALREADY_EXISTS"
                return r0
            L34:
                r0 = 1004(0x3ec, float:1.407E-42)
                if (r1 != r0) goto L3b
                java.lang.String r0 = "HTTP_DATA_ERROR"
                return r0
            L3b:
                r0 = 1005(0x3ed, float:1.408E-42)
                if (r1 != r0) goto L42
                java.lang.String r0 = "TOO_MANY_REDIRECTS"
                return r0
            L42:
                r0 = 400(0x190, float:5.6E-43)
                if (r0 > r1) goto L4d
                r0 = 600(0x258, float:8.41E-43)
                if (r1 >= r0) goto L4d
                java.lang.String r0 = "HTTP_ERROR"
                return r0
            L4d:
                java.lang.String r0 = "DOWNLOAD_FAILED"
                return r0
        }
    }

    public static final class b {

        /* JADX INFO: renamed from: a, reason: collision with root package name */
        private final long f1485a;

        /* JADX INFO: renamed from: b, reason: collision with root package name */
        private final int f1486b;

        /* JADX INFO: renamed from: c, reason: collision with root package name */
        private final long f1487c;

        /* JADX INFO: renamed from: d, reason: collision with root package name */
        private final int f1488d;

        /* JADX INFO: renamed from: e, reason: collision with root package name */
        private final java.io.File f1489e;

        public b(long r2, int r4, long r5, int r7, java.io.File r8) {
                r1 = this;
                java.lang.String r0 = "file"
                J3.l.f(r8, r0)
                r1.<init>()
                r1.f1485a = r2
                r1.f1486b = r4
                r1.f1487c = r5
                r1.f1488d = r7
                r1.f1489e = r8
                return
        }

        public final java.io.File a() {
                r0 = this;
                java.io.File r0 = r0.f1489e
                return r0
        }

        public final long b() {
                r2 = this;
                long r0 = r2.f1485a
                return r0
        }

        public final int c() {
                r0 = this;
                int r0 = r0.f1488d
                return r0
        }

        public final long d() {
                r2 = this;
                long r0 = r2.f1487c
                return r0
        }

        public final int e() {
                r0 = this;
                int r0 = r0.f1486b
                return r0
        }

        public boolean equals(java.lang.Object r8) {
                r7 = this;
                r0 = 1
                if (r7 != r8) goto L4
                return r0
            L4:
                boolean r1 = r8 instanceof K5.A0.b
                r2 = 0
                if (r1 != 0) goto La
                return r2
            La:
                K5.A0$b r8 = (K5.A0.b) r8
                long r3 = r7.f1485a
                long r5 = r8.f1485a
                int r1 = (r3 > r5 ? 1 : (r3 == r5 ? 0 : -1))
                if (r1 == 0) goto L15
                return r2
            L15:
                int r1 = r7.f1486b
                int r3 = r8.f1486b
                if (r1 == r3) goto L1c
                return r2
            L1c:
                long r3 = r7.f1487c
                long r5 = r8.f1487c
                int r1 = (r3 > r5 ? 1 : (r3 == r5 ? 0 : -1))
                if (r1 == 0) goto L25
                return r2
            L25:
                int r1 = r7.f1488d
                int r3 = r8.f1488d
                if (r1 == r3) goto L2c
                return r2
            L2c:
                java.io.File r7 = r7.f1489e
                java.io.File r8 = r8.f1489e
                boolean r7 = J3.l.b(r7, r8)
                if (r7 != 0) goto L37
                return r2
            L37:
                return r0
        }

        public int hashCode() {
                r3 = this;
                long r0 = r3.f1485a
                int r0 = java.lang.Long.hashCode(r0)
                int r0 = r0 * 31
                int r1 = r3.f1486b
                int r1 = java.lang.Integer.hashCode(r1)
                int r0 = r0 + r1
                int r0 = r0 * 31
                long r1 = r3.f1487c
                int r1 = java.lang.Long.hashCode(r1)
                int r0 = r0 + r1
                int r0 = r0 * 31
                int r1 = r3.f1488d
                int r1 = java.lang.Integer.hashCode(r1)
                int r0 = r0 + r1
                int r0 = r0 * 31
                java.io.File r3 = r3.f1489e
                int r3 = r3.hashCode()
                int r0 = r0 + r3
                return r0
        }

        public java.lang.String toString() {
                r8 = this;
                long r0 = r8.f1485a
                int r2 = r8.f1486b
                long r3 = r8.f1487c
                int r5 = r8.f1488d
                java.io.File r8 = r8.f1489e
                java.lang.StringBuilder r6 = new java.lang.StringBuilder
                r6.<init>()
                java.lang.String r7 = "Job(id="
                r6.append(r7)
                r6.append(r0)
                java.lang.String r0 = ", status="
                r6.append(r0)
                r6.append(r2)
                java.lang.String r0 = ", received="
                r6.append(r0)
                r6.append(r3)
                java.lang.String r0 = ", reason="
                r6.append(r0)
                r6.append(r5)
                java.lang.String r0 = ", file="
                r6.append(r0)
                r6.append(r8)
                java.lang.String r8 = ")"
                r6.append(r8)
                java.lang.String r8 = r6.toString()
                return r8
        }
    }

    static {
            K5.A0$a r0 = new K5.A0$a
            r1 = 0
            r0.<init>(r1)
            K5.A0.f1473k = r0
            return
    }

    private A0(android.content.Context r5) {
            r4 = this;
            r4.<init>()
            r4.f1475a = r5
            java.lang.String r0 = "solaris-model-transfer-v2"
            r1 = 0
            android.content.SharedPreferences r0 = r5.getSharedPreferences(r0, r1)
            r4.f1476b = r0
            java.io.File r0 = new java.io.File
            java.io.File r2 = r5.getFilesDir()
            java.lang.String r3 = "solaris-qvac-models"
            r0.<init>(r2, r3)
            r0.mkdirs()
            r4.f1477c = r0
            java.io.File r2 = new java.io.File
            java.lang.String r3 = "Qwen3-0.6B-Q4_0.gguf"
            r2.<init>(r0, r3)
            r4.f1478d = r2
            java.io.File r0 = new java.io.File
            java.io.File r5 = r5.getFilesDir()
            java.lang.String r2 = "solaris-qvac-download.json"
            r0.<init>(r5, r2)
            r4.f1479e = r0
            java.util.concurrent.atomic.AtomicBoolean r5 = new java.util.concurrent.atomic.AtomicBoolean
            r5.<init>(r1)
            r4.f1480f = r5
            return
    }

    public /* synthetic */ A0(android.content.Context r1, kotlin.jvm.internal.DefaultConstructorMarker r2) {
            r0 = this;
            r0.<init>(r1)
            return
    }

    public static /* synthetic */ p137u3.A a(K5.A0 r0, kotlin.jvm.functions.Function1 r1, long r2) {
            u3.A r0 = r(r0, r1, r2)
            return r0
    }

    public static final /* synthetic */ K5.A0 b() {
            K5.A0 r0 = K5.A0.f1474l
            return r0
    }

    public static final /* synthetic */ void c(K5.A0 r0) {
            K5.A0.f1474l = r0
            return
    }

    private final java.io.File e(K5.A0.b r7) {
            r6 = this;
            java.io.File r0 = r6.f1478d
            java.io.File r1 = r6.l()
            java.io.File r2 = new java.io.File
            java.io.File r3 = r6.f1477c
            java.lang.String r4 = "download.partial"
            r2.<init>(r3, r4)
            java.io.File r3 = new java.io.File
            java.io.File r6 = r6.f1477c
            java.lang.String r4 = "import.partial"
            r3.<init>(r6, r4)
            r6 = 0
            if (r7 == 0) goto L2c
            int r4 = r7.e()
            r5 = 8
            if (r4 != r5) goto L24
            goto L25
        L24:
            r7 = r6
        L25:
            if (r7 == 0) goto L2c
            java.io.File r7 = r7.a()
            goto L2d
        L2c:
            r7 = r6
        L2d:
            java.io.File[] r7 = new java.io.File[]{r0, r1, r2, r3, r7}
            java.util.List r7 = p143v3.AbstractC1216q.o(r7)
            java.util.Iterator r7 = r7.iterator()
        L39:
            boolean r0 = r7.hasNext()
            if (r0 == 0) goto L58
            java.lang.Object r0 = r7.next()
            r1 = r0
            java.io.File r1 = (java.io.File) r1
            boolean r2 = r1.isFile()
            if (r2 == 0) goto L39
            long r1 = r1.length()
            r3 = 382156480(0x16c73ec0, double:1.88810388E-315)
            int r1 = (r1 > r3 ? 1 : (r1 == r3 ? 0 : -1))
            if (r1 != 0) goto L39
            r6 = r0
        L58:
            java.io.File r6 = (java.io.File) r6
            return r6
    }

    private final java.io.File f() {
            r1 = this;
            android.content.Context r1 = r1.f1475a
            java.lang.String r0 = "solaris-models"
            java.io.File r1 = r1.getExternalFilesDir(r0)
            if (r1 == 0) goto Lb
            return r1
        Lb:
            java.lang.IllegalStateException r1 = new java.lang.IllegalStateException
            java.lang.String r0 = "STORAGE_UNAVAILABLE"
            r1.<init>(r0)
            throw r1
    }

    private final android.app.DownloadManager g() {
            r1 = this;
            android.content.Context r1 = r1.f1475a
            java.lang.String r0 = "download"
            java.lang.Object r1 = r1.getSystemService(r0)
            java.lang.String r0 = "null cannot be cast to non-null type android.app.DownloadManager"
            J3.l.d(r1, r0)
            android.app.DownloadManager r1 = (android.app.DownloadManager) r1
            return r1
    }

    private final K5.A0.b h() {
            r13 = this;
            java.util.List r0 = r13.i()
            java.util.ArrayList r1 = new java.util.ArrayList
            r1.<init>()
            java.util.Iterator r2 = r0.iterator()
        Ld:
            boolean r3 = r2.hasNext()
            if (r3 == 0) goto L30
            java.lang.Object r3 = r2.next()
            r4 = r3
            K5.A0$b r4 = (K5.A0.b) r4
            int r5 = r4.e()
            r6 = 8
            if (r5 != r6) goto Ld
            java.io.File r4 = r4.a()
            boolean r4 = r4.isFile()
            if (r4 == 0) goto Ld
            r1.add(r3)
            goto Ld
        L30:
            java.util.Iterator r1 = r1.iterator()
            boolean r2 = r1.hasNext()
            r3 = 0
            if (r2 != 0) goto L3d
            r2 = r3
            goto L66
        L3d:
            java.lang.Object r2 = r1.next()
            boolean r4 = r1.hasNext()
            if (r4 != 0) goto L48
            goto L66
        L48:
            r4 = r2
            K5.A0$b r4 = (K5.A0.b) r4
            long r4 = r4.b()
        L4f:
            java.lang.Object r6 = r1.next()
            r7 = r6
            K5.A0$b r7 = (K5.A0.b) r7
            long r7 = r7.b()
            int r9 = (r4 > r7 ? 1 : (r4 == r7 ? 0 : -1))
            if (r9 >= 0) goto L60
            r2 = r6
            r4 = r7
        L60:
            boolean r6 = r1.hasNext()
            if (r6 != 0) goto L4f
        L66:
            K5.A0$b r2 = (K5.A0.b) r2
            r4 = -1
            java.lang.String r1 = "id"
            if (r2 != 0) goto Lf0
            java.util.ArrayList r2 = new java.util.ArrayList
            r2.<init>()
            java.util.Iterator r6 = r0.iterator()
        L77:
            boolean r7 = r6.hasNext()
            if (r7 == 0) goto L94
            java.lang.Object r7 = r6.next()
            r8 = r7
            K5.A0$b r8 = (K5.A0.b) r8
            K5.A0$a r9 = K5.A0.f1473k
            int r8 = r8.e()
            boolean r8 = r9.a(r8)
            if (r8 == 0) goto L77
            r2.add(r7)
            goto L77
        L94:
            java.util.Iterator r6 = r2.iterator()
            boolean r2 = r6.hasNext()
            if (r2 != 0) goto La0
            r2 = r3
            goto Lc9
        La0:
            java.lang.Object r2 = r6.next()
            boolean r7 = r6.hasNext()
            if (r7 != 0) goto Lab
            goto Lc9
        Lab:
            r7 = r2
            K5.A0$b r7 = (K5.A0.b) r7
            long r7 = r7.d()
        Lb2:
            java.lang.Object r9 = r6.next()
            r10 = r9
            K5.A0$b r10 = (K5.A0.b) r10
            long r10 = r10.d()
            int r12 = (r7 > r10 ? 1 : (r7 == r10 ? 0 : -1))
            if (r12 >= 0) goto Lc3
            r2 = r9
            r7 = r10
        Lc3:
            boolean r9 = r6.hasNext()
            if (r9 != 0) goto Lb2
        Lc9:
            K5.A0$b r2 = (K5.A0.b) r2
            if (r2 != 0) goto Lf0
            java.util.Iterator r0 = r0.iterator()
        Ld1:
            boolean r2 = r0.hasNext()
            if (r2 == 0) goto Led
            java.lang.Object r2 = r0.next()
            r6 = r2
            K5.A0$b r6 = (K5.A0.b) r6
            long r6 = r6.b()
            android.content.SharedPreferences r8 = r13.f1476b
            long r8 = r8.getLong(r1, r4)
            int r6 = (r6 > r8 ? 1 : (r6 == r8 ? 0 : -1))
            if (r6 != 0) goto Ld1
            r3 = r2
        Led:
            r2 = r3
            K5.A0$b r2 = (K5.A0.b) r2
        Lf0:
            if (r2 == 0) goto L107
            long r6 = r2.b()
            android.content.SharedPreferences r0 = r13.f1476b
            long r0 = r0.getLong(r1, r4)
            int r0 = (r6 > r0 ? 1 : (r6 == r0 ? 0 : -1))
            if (r0 == 0) goto L107
            long r0 = r2.b()
            r13.m(r0)
        L107:
            return r2
    }

    private final java.util.List i() {
            r14 = this;
            java.util.ArrayList r1 = new java.util.ArrayList
            r1.<init>()
            android.app.DownloadManager r0 = r14.g()
            android.app.DownloadManager$Query r2 = new android.app.DownloadManager$Query
            r2.<init>()
            android.database.Cursor r2 = r0.query(r2)
            if (r2 == 0) goto Ld4
        L14:
            boolean r0 = r2.moveToNext()     // Catch: java.lang.Throwable -> Lc5
            r3 = 0
            if (r0 == 0) goto Lc8
            java.lang.String r0 = "uri"
            java.lang.String r0 = k(r2, r0)     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r4 = "https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/50968a4468ef4233ed78cd7c3de230dd1d61a56b/Qwen3-0.6B-Q4_0.gguf"
            boolean r0 = J3.l.b(r0, r4)     // Catch: java.lang.Throwable -> Lc5
            if (r0 == 0) goto L14
            u3.n$a r0 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L3a
            java.lang.String r0 = "local_uri"
            java.lang.String r0 = k(r2, r0)     // Catch: java.lang.Throwable -> L3a
            android.net.Uri r0 = android.net.Uri.parse(r0)     // Catch: java.lang.Throwable -> L3a
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L3a
            goto L45
        L3a:
            r0 = move-exception
            u3.n$a r4 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> Lc5
            java.lang.Object r0 = p137u3.o.a(r0)     // Catch: java.lang.Throwable -> Lc5
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> Lc5
        L45:
            boolean r4 = p137u3.n.c(r0)     // Catch: java.lang.Throwable -> Lc5
            if (r4 == 0) goto L4c
            goto L4d
        L4c:
            r3 = r0
        L4d:
            android.net.Uri r3 = (android.net.Uri) r3     // Catch: java.lang.Throwable -> Lc5
            if (r3 != 0) goto L52
            goto L14
        L52:
            java.lang.String r0 = r3.getScheme()     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r4 = "file"
            boolean r0 = J3.l.b(r0, r4)     // Catch: java.lang.Throwable -> Lc5
            if (r0 == 0) goto L14
            java.lang.String r0 = r3.getPath()     // Catch: java.lang.Throwable -> Lc5
            if (r0 != 0) goto L65
            goto L14
        L65:
            java.io.File r3 = new java.io.File     // Catch: java.lang.Throwable -> Lc5
            r3.<init>(r0)     // Catch: java.lang.Throwable -> Lc5
            java.io.File r11 = r3.getCanonicalFile()     // Catch: java.lang.Throwable -> Lc5
            java.io.File r0 = r11.getParentFile()     // Catch: java.lang.Throwable -> Lc5
            java.io.File r3 = r14.f()     // Catch: java.lang.Throwable -> Lc5
            java.io.File r3 = r3.getCanonicalFile()     // Catch: java.lang.Throwable -> Lc5
            boolean r0 = J3.l.b(r0, r3)     // Catch: java.lang.Throwable -> Lc5
            if (r0 == 0) goto L14
            java.lang.String r0 = r11.getName()     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r3 = "getName(...)"
            J3.l.e(r0, r3)     // Catch: java.lang.Throwable -> Lc5
            d5.o r3 = new d5.o     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r4 = "[a-f0-9-]{36}\\.partial"
            r3.<init>(r4)     // Catch: java.lang.Throwable -> Lc5
            boolean r0 = r3.e(r0)     // Catch: java.lang.Throwable -> Lc5
            if (r0 != 0) goto L98
            goto L14
        L98:
            K5.A0$b r4 = new K5.A0$b     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r0 = "_id"
            long r5 = j(r2, r0)     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r0 = "status"
            long r7 = j(r2, r0)     // Catch: java.lang.Throwable -> Lc5
            int r7 = (int) r7     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r0 = "bytes_so_far"
            long r8 = j(r2, r0)     // Catch: java.lang.Throwable -> Lc5
            r12 = 0
            long r8 = P3.g.d(r8, r12)     // Catch: java.lang.Throwable -> Lc5
            java.lang.String r0 = "reason"
            long r12 = j(r2, r0)     // Catch: java.lang.Throwable -> Lc5
            int r10 = (int) r12     // Catch: java.lang.Throwable -> Lc5
            J3.l.c(r11)     // Catch: java.lang.Throwable -> Lc5
            r4.<init>(r5, r7, r8, r10, r11)     // Catch: java.lang.Throwable -> Lc5
            r1.add(r4)     // Catch: java.lang.Throwable -> Lc5
            goto L14
        Lc5:
            r0 = move-exception
            r14 = r0
            goto Lce
        Lc8:
            u3.A r14 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> Lc5
            F3.c.a(r2, r3)
            return r1
        Lce:
            throw r14     // Catch: java.lang.Throwable -> Lcf
        Lcf:
            r0 = move-exception
            F3.c.a(r2, r14)
            throw r0
        Ld4:
            return r1
    }

    private static final long j(android.database.Cursor r0, java.lang.String r1) {
            int r1 = r0.getColumnIndexOrThrow(r1)
            long r0 = r0.getLong(r1)
            return r0
    }

    private static final java.lang.String k(android.database.Cursor r0, java.lang.String r1) {
            int r1 = r0.getColumnIndexOrThrow(r1)
            java.lang.String r0 = r0.getString(r1)
            return r0
    }

    private final java.io.File l() {
            r6 = this;
            java.io.File r0 = r6.f1479e
            boolean r0 = r0.isFile()
            r1 = 0
            if (r0 == 0) goto Lba
            java.io.File r0 = r6.f1479e
            long r2 = r0.length()
            r4 = 4096(0x1000, double:2.0237E-320)
            int r0 = (r2 > r4 ? 1 : (r2 == r4 ? 0 : -1))
            if (r0 <= 0) goto L17
            goto Lba
        L17:
            u3.n$a r0 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L8b
            org.json.JSONObject r0 = new org.json.JSONObject     // Catch: java.lang.Throwable -> L8b
            java.io.File r2 = r6.f1479e     // Catch: java.lang.Throwable -> L8b
            r3 = 1
            java.lang.String r2 = F3.j.d(r2, r1, r3, r1)     // Catch: java.lang.Throwable -> L8b
            r0.<init>(r2)     // Catch: java.lang.Throwable -> L8b
            java.lang.String r2 = "checksum"
            java.lang.String r2 = r0.optString(r2)     // Catch: java.lang.Throwable -> L8b
            java.lang.String r3 = "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb"
            boolean r2 = J3.l.b(r2, r3)     // Catch: java.lang.Throwable -> L8b
            if (r2 != 0) goto L34
            return r1
        L34:
            java.lang.String r2 = "path"
            java.lang.String r0 = r0.getString(r2)     // Catch: java.lang.Throwable -> L8b
            java.lang.String r2 = "getString(...)"
            J3.l.e(r0, r2)     // Catch: java.lang.Throwable -> L8b
            java.lang.String r2 = "file://"
            java.lang.String r0 = p027d5.q.u0(r0, r2)     // Catch: java.lang.Throwable -> L8b
            java.io.File r2 = new java.io.File     // Catch: java.lang.Throwable -> L8b
            r2.<init>(r0)     // Catch: java.lang.Throwable -> L8b
            java.io.File r0 = r2.getCanonicalFile()     // Catch: java.lang.Throwable -> L8b
            java.lang.String r2 = r0.getName()     // Catch: java.lang.Throwable -> L8b
            java.lang.String r3 = "Qwen3-0.6B-Q4_0.gguf"
            boolean r2 = J3.l.b(r2, r3)     // Catch: java.lang.Throwable -> L8b
            if (r2 == 0) goto La5
            java.nio.file.Path r2 = r0.toPath()     // Catch: java.lang.Throwable -> L8b
            android.content.Context r3 = r6.f1475a     // Catch: java.lang.Throwable -> L8b
            java.io.File r3 = r3.getFilesDir()     // Catch: java.lang.Throwable -> L8b
            java.io.File r3 = r3.getCanonicalFile()     // Catch: java.lang.Throwable -> L8b
            java.nio.file.Path r3 = r3.toPath()     // Catch: java.lang.Throwable -> L8b
            boolean r2 = r2.startsWith(r3)     // Catch: java.lang.Throwable -> L8b
            if (r2 != 0) goto L8d
            java.nio.file.Path r2 = r0.toPath()     // Catch: java.lang.Throwable -> L8b
            android.content.Context r6 = r6.f1475a     // Catch: java.lang.Throwable -> L8b
            java.io.File r6 = r6.getCacheDir()     // Catch: java.lang.Throwable -> L8b
            java.io.File r6 = r6.getCanonicalFile()     // Catch: java.lang.Throwable -> L8b
            java.nio.file.Path r6 = r6.toPath()     // Catch: java.lang.Throwable -> L8b
            boolean r6 = r2.startsWith(r6)     // Catch: java.lang.Throwable -> L8b
            if (r6 != 0) goto L8d
            goto La5
        L8b:
            r6 = move-exception
            goto La6
        L8d:
            boolean r6 = r0.isFile()     // Catch: java.lang.Throwable -> L8b
            if (r6 == 0) goto L9f
            long r2 = r0.length()     // Catch: java.lang.Throwable -> L8b
            r4 = 382156480(0x16c73ec0, double:1.88810388E-315)
            int r6 = (r2 > r4 ? 1 : (r2 == r4 ? 0 : -1))
            if (r6 != 0) goto L9f
            goto La0
        L9f:
            r0 = r1
        La0:
            java.lang.Object r6 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L8b
            goto Lb0
        La5:
            return r1
        La6:
            u3.n$a r0 = p137u3.n.f16184f
            java.lang.Object r6 = p137u3.o.a(r6)
            java.lang.Object r6 = p137u3.n.a(r6)
        Lb0:
            boolean r0 = p137u3.n.c(r6)
            if (r0 == 0) goto Lb7
            goto Lb8
        Lb7:
            r1 = r6
        Lb8:
            java.io.File r1 = (java.io.File) r1
        Lba:
            return r1
    }

    private final void m(long r2) {
            r1 = this;
            android.content.SharedPreferences r1 = r1.f1476b
            android.content.SharedPreferences$Editor r1 = r1.edit()
            java.lang.String r0 = "id"
            android.content.SharedPreferences$Editor r1 = r1.putLong(r0, r2)
            java.lang.String r2 = "manifest"
            java.lang.String r3 = "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb"
            android.content.SharedPreferences$Editor r1 = r1.putString(r2, r3)
            boolean r1 = r1.commit()
            if (r1 == 0) goto L1b
            return
        L1b:
            java.lang.IllegalStateException r1 = new java.lang.IllegalStateException
            java.lang.String r2 = "TRANSFER_STATE_FAILED"
            r1.<init>(r2)
            throw r1
    }

    private static final p137u3.A r(K5.A0 r0, kotlin.jvm.functions.Function1 r1, long r2) {
            r0.f1483i = r2
            java.util.Map r0 = r0.o()
            r1.q(r0)
            u3.A r0 = p137u3.A.f16167a
            return r0
    }

    public final synchronized java.util.Map d(boolean r7) {
            r6 = this;
            monitor-enter(r6)
            boolean r0 = r6.f1481g     // Catch: java.lang.Throwable -> L20
            if (r0 != 0) goto Le2
            K5.A0$b r0 = r6.h()     // Catch: java.lang.Throwable -> L20
            java.io.File r1 = r6.e(r0)     // Catch: java.lang.Throwable -> L20
            if (r1 != 0) goto Ldc
            r1 = 1
            if (r0 == 0) goto L23
            K5.A0$a r2 = K5.A0.f1473k     // Catch: java.lang.Throwable -> L20
            int r0 = r0.e()     // Catch: java.lang.Throwable -> L20
            boolean r0 = r2.a(r0)     // Catch: java.lang.Throwable -> L20
            if (r0 != r1) goto L23
            goto Ldc
        L20:
            r7 = move-exception
            goto Lea
        L23:
            android.os.StatFs r0 = new android.os.StatFs     // Catch: java.lang.Throwable -> L20
            java.io.File r2 = r6.f1477c     // Catch: java.lang.Throwable -> L20
            java.lang.String r2 = r2.getPath()     // Catch: java.lang.Throwable -> L20
            r0.<init>(r2)     // Catch: java.lang.Throwable -> L20
            long r2 = r0.getAvailableBytes()     // Catch: java.lang.Throwable -> L20
            r4 = 898530688(0x358e7d80, double:4.439331447E-315)
            int r0 = (r2 > r4 ? 1 : (r2 == r4 ? 0 : -1))
            if (r0 < 0) goto Ld4
            java.io.File r0 = r6.f()     // Catch: java.lang.Throwable -> L20
            boolean r0 = r0.mkdirs()     // Catch: java.lang.Throwable -> L20
            if (r0 != 0) goto L56
            java.io.File r0 = r6.f()     // Catch: java.lang.Throwable -> L20
            boolean r0 = r0.isDirectory()     // Catch: java.lang.Throwable -> L20
            if (r0 == 0) goto L4e
            goto L56
        L4e:
            java.lang.String r7 = "STORAGE_UNAVAILABLE"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L20
            r0.<init>(r7)     // Catch: java.lang.Throwable -> L20
            throw r0     // Catch: java.lang.Throwable -> L20
        L56:
            android.os.StatFs r0 = new android.os.StatFs     // Catch: java.lang.Throwable -> L20
            java.io.File r2 = r6.f()     // Catch: java.lang.Throwable -> L20
            java.lang.String r2 = r2.getPath()     // Catch: java.lang.Throwable -> L20
            r0.<init>(r2)     // Catch: java.lang.Throwable -> L20
            long r2 = r0.getAvailableBytes()     // Catch: java.lang.Throwable -> L20
            r4 = 516374208(0x1ec73ec0, double:2.551227566E-315)
            int r0 = (r2 > r4 ? 1 : (r2 == r4 ? 0 : -1))
            if (r0 < 0) goto Lcc
            r0 = 0
            r6.f1484j = r0     // Catch: java.lang.Throwable -> L20
            java.util.UUID r0 = java.util.UUID.randomUUID()     // Catch: java.lang.Throwable -> L20
            java.lang.StringBuilder r2 = new java.lang.StringBuilder     // Catch: java.lang.Throwable -> L20
            r2.<init>()     // Catch: java.lang.Throwable -> L20
            r2.append(r0)     // Catch: java.lang.Throwable -> L20
            java.lang.String r0 = ".partial"
            r2.append(r0)     // Catch: java.lang.Throwable -> L20
            java.lang.String r0 = r2.toString()     // Catch: java.lang.Throwable -> L20
            android.app.DownloadManager$Request r2 = new android.app.DownloadManager$Request     // Catch: java.lang.Throwable -> L20
            java.lang.String r3 = "https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/50968a4468ef4233ed78cd7c3de230dd1d61a56b/Qwen3-0.6B-Q4_0.gguf"
            android.net.Uri r3 = android.net.Uri.parse(r3)     // Catch: java.lang.Throwable -> L20
            r2.<init>(r3)     // Catch: java.lang.Throwable -> L20
            android.content.Context r3 = r6.f1475a     // Catch: java.lang.Throwable -> L20
            java.lang.String r4 = "solaris-models"
            android.app.DownloadManager$Request r0 = r2.setDestinationInExternalFilesDir(r3, r4, r0)     // Catch: java.lang.Throwable -> L20
            java.lang.String r2 = "Solaris · LUCA model"
            android.app.DownloadManager$Request r0 = r0.setTitle(r2)     // Catch: java.lang.Throwable -> L20
            java.lang.String r2 = "Downloading your optional on-device model"
            android.app.DownloadManager$Request r0 = r0.setDescription(r2)     // Catch: java.lang.Throwable -> L20
            android.app.DownloadManager$Request r0 = r0.setNotificationVisibility(r1)     // Catch: java.lang.Throwable -> L20
            android.app.DownloadManager$Request r0 = r0.setAllowedOverMetered(r7)     // Catch: java.lang.Throwable -> L20
            r1 = 0
            android.app.DownloadManager$Request r0 = r0.setAllowedOverRoaming(r1)     // Catch: java.lang.Throwable -> L20
            if (r7 == 0) goto Lb6
            r7 = 3
            goto Lb7
        Lb6:
            r7 = 2
        Lb7:
            android.app.DownloadManager$Request r7 = r0.setAllowedNetworkTypes(r7)     // Catch: java.lang.Throwable -> L20
            android.app.DownloadManager r0 = r6.g()     // Catch: java.lang.Throwable -> L20
            long r0 = r0.enqueue(r7)     // Catch: java.lang.Throwable -> L20
            r6.m(r0)     // Catch: java.lang.Throwable -> L20
            java.util.Map r7 = r6.o()     // Catch: java.lang.Throwable -> L20
            monitor-exit(r6)
            return r7
        Lcc:
            java.lang.String r7 = "INSUFFICIENT_SPACE"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L20
            r0.<init>(r7)     // Catch: java.lang.Throwable -> L20
            throw r0     // Catch: java.lang.Throwable -> L20
        Ld4:
            java.lang.String r7 = "INSUFFICIENT_SPACE"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L20
            r0.<init>(r7)     // Catch: java.lang.Throwable -> L20
            throw r0     // Catch: java.lang.Throwable -> L20
        Ldc:
            java.util.Map r7 = r6.o()     // Catch: java.lang.Throwable -> L20
            monitor-exit(r6)
            return r7
        Le2:
            java.lang.String r7 = "VERIFY_BUSY"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L20
            r0.<init>(r7)     // Catch: java.lang.Throwable -> L20
            throw r0     // Catch: java.lang.Throwable -> L20
        Lea:
            monitor-exit(r6)     // Catch: java.lang.Throwable -> L20
            throw r7
    }

    public final synchronized java.util.Map n() {
            r9 = this;
            monitor-enter(r9)
            boolean r0 = r9.f1481g     // Catch: java.lang.Throwable -> L2f
            if (r0 != 0) goto La5
            java.io.File r3 = r9.l()     // Catch: java.lang.Throwable -> L2f
            java.util.List r0 = r9.i()     // Catch: java.lang.Throwable -> L2f
            java.util.Iterator r0 = r0.iterator()     // Catch: java.lang.Throwable -> L2f
        L11:
            boolean r1 = r0.hasNext()     // Catch: java.lang.Throwable -> L2f
            r7 = 0
            if (r1 == 0) goto L32
            java.lang.Object r1 = r0.next()     // Catch: java.lang.Throwable -> L2f
            K5.A0$b r1 = (K5.A0.b) r1     // Catch: java.lang.Throwable -> L2f
            android.app.DownloadManager r2 = r9.g()     // Catch: java.lang.Throwable -> L2f
            long r4 = r1.b()     // Catch: java.lang.Throwable -> L2f
            r1 = 1
            long[] r1 = new long[r1]     // Catch: java.lang.Throwable -> L2f
            r1[r7] = r4     // Catch: java.lang.Throwable -> L2f
            r2.remove(r1)     // Catch: java.lang.Throwable -> L2f
            goto L11
        L2f:
            r0 = move-exception
            goto Lad
        L32:
            java.io.File r1 = r9.f1478d     // Catch: java.lang.Throwable -> L2f
            java.io.File r2 = r9.f1479e     // Catch: java.lang.Throwable -> L2f
            java.io.File r4 = new java.io.File     // Catch: java.lang.Throwable -> L2f
            java.io.File r0 = r9.f1477c     // Catch: java.lang.Throwable -> L2f
            java.lang.String r5 = "download.partial"
            r4.<init>(r0, r5)     // Catch: java.lang.Throwable -> L2f
            java.io.File r5 = new java.io.File     // Catch: java.lang.Throwable -> L2f
            java.io.File r0 = r9.f1477c     // Catch: java.lang.Throwable -> L2f
            java.lang.String r6 = "import.partial"
            r5.<init>(r0, r6)     // Catch: java.lang.Throwable -> L2f
            java.io.File r6 = new java.io.File     // Catch: java.lang.Throwable -> L2f
            java.io.File r0 = r9.f1477c     // Catch: java.lang.Throwable -> L2f
            java.lang.String r8 = "verified.partial"
            r6.<init>(r0, r8)     // Catch: java.lang.Throwable -> L2f
            java.io.File[] r0 = new java.io.File[]{r1, r2, r3, r4, r5, r6}     // Catch: java.lang.Throwable -> L2f
            java.util.List r0 = p143v3.AbstractC1216q.o(r0)     // Catch: java.lang.Throwable -> L2f
            java.util.List r0 = p143v3.AbstractC1216q.U(r0)     // Catch: java.lang.Throwable -> L2f
            java.util.Iterator r0 = r0.iterator()     // Catch: java.lang.Throwable -> L2f
        L61:
            boolean r1 = r0.hasNext()     // Catch: java.lang.Throwable -> L2f
            if (r1 == 0) goto L82
            java.lang.Object r1 = r0.next()     // Catch: java.lang.Throwable -> L2f
            java.io.File r1 = (java.io.File) r1     // Catch: java.lang.Throwable -> L2f
            boolean r2 = r1.exists()     // Catch: java.lang.Throwable -> L2f
            if (r2 == 0) goto L61
            boolean r1 = r1.delete()     // Catch: java.lang.Throwable -> L2f
            if (r1 == 0) goto L7a
            goto L61
        L7a:
            java.lang.String r0 = "MODEL_REMOVE_FAILED"
            java.lang.IllegalStateException r1 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L2f
            r1.<init>(r0)     // Catch: java.lang.Throwable -> L2f
            throw r1     // Catch: java.lang.Throwable -> L2f
        L82:
            android.content.SharedPreferences r0 = r9.f1476b     // Catch: java.lang.Throwable -> L2f
            android.content.SharedPreferences$Editor r0 = r0.edit()     // Catch: java.lang.Throwable -> L2f
            android.content.SharedPreferences$Editor r0 = r0.clear()     // Catch: java.lang.Throwable -> L2f
            boolean r0 = r0.commit()     // Catch: java.lang.Throwable -> L2f
            if (r0 == 0) goto L9d
            r9.f1482h = r7     // Catch: java.lang.Throwable -> L2f
            r0 = 0
            r9.f1484j = r0     // Catch: java.lang.Throwable -> L2f
            java.util.Map r0 = r9.o()     // Catch: java.lang.Throwable -> L2f
            monitor-exit(r9)
            return r0
        L9d:
            java.lang.String r0 = "TRANSFER_STATE_FAILED"
            java.lang.IllegalStateException r1 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L2f
            r1.<init>(r0)     // Catch: java.lang.Throwable -> L2f
            throw r1     // Catch: java.lang.Throwable -> L2f
        La5:
            java.lang.String r0 = "VERIFY_BUSY"
            java.lang.IllegalStateException r1 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L2f
            r1.<init>(r0)     // Catch: java.lang.Throwable -> L2f
            throw r1     // Catch: java.lang.Throwable -> L2f
        Lad:
            monitor-exit(r9)     // Catch: java.lang.Throwable -> L2f
            throw r0
    }

    public final synchronized java.util.Map o() {
            r24 = this;
            r1 = r24
            r2 = 382156480(0x16c73ec0, double:1.88810388E-315)
            java.lang.Long r4 = java.lang.Long.valueOf(r2)
            monitor-enter(r24)
            u3.n$a r0 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L16
            K5.A0$b r0 = r1.h()     // Catch: java.lang.Throwable -> L16
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L16
        L14:
            r5 = r0
            goto L22
        L16:
            r0 = move-exception
            u3.n$a r5 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L3e
            java.lang.Object r0 = p137u3.o.a(r0)     // Catch: java.lang.Throwable -> L3e
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L3e
            goto L14
        L22:
            boolean r0 = p137u3.n.c(r5)     // Catch: java.lang.Throwable -> L3e
            if (r0 == 0) goto L2a
            r0 = 0
            goto L2b
        L2a:
            r0 = r5
        L2b:
            r7 = r0
            K5.A0$b r7 = (K5.A0.b) r7     // Catch: java.lang.Throwable -> L3e
            java.io.File r8 = r1.e(r7)     // Catch: java.lang.Throwable -> L3e
            java.io.File r0 = r1.f1478d     // Catch: java.lang.Throwable -> L3e
            boolean r0 = r0.isFile()     // Catch: java.lang.Throwable -> L3e
            r9 = 0
            if (r0 != 0) goto L41
            r1.f1482h = r9     // Catch: java.lang.Throwable -> L3e
            goto L41
        L3e:
            r0 = move-exception
            goto L1e7
        L41:
            java.io.File r0 = new java.io.File     // Catch: java.lang.Throwable -> L3e
            java.io.File r10 = r1.f1477c     // Catch: java.lang.Throwable -> L3e
            java.lang.String r11 = "download.partial"
            r0.<init>(r10, r11)     // Catch: java.lang.Throwable -> L3e
            java.io.File r10 = new java.io.File     // Catch: java.lang.Throwable -> L3e
            java.io.File r11 = r1.f1477c     // Catch: java.lang.Throwable -> L3e
            java.lang.String r12 = "import.partial"
            r10.<init>(r11, r12)     // Catch: java.lang.Throwable -> L3e
            java.io.File[] r0 = new java.io.File[]{r0, r10}     // Catch: java.lang.Throwable -> L3e
            java.util.List r0 = p143v3.AbstractC1216q.m(r0)     // Catch: java.lang.Throwable -> L3e
            r10 = 1
            if (r0 == 0) goto L66
            boolean r11 = r0.isEmpty()     // Catch: java.lang.Throwable -> L3e
            if (r11 == 0) goto L66
        L64:
            r2 = r9
            goto L8b
        L66:
            java.util.Iterator r0 = r0.iterator()     // Catch: java.lang.Throwable -> L3e
        L6a:
            boolean r11 = r0.hasNext()     // Catch: java.lang.Throwable -> L3e
            if (r11 == 0) goto L64
            java.lang.Object r11 = r0.next()     // Catch: java.lang.Throwable -> L3e
            java.io.File r11 = (java.io.File) r11     // Catch: java.lang.Throwable -> L3e
            boolean r12 = r11.isFile()     // Catch: java.lang.Throwable -> L3e
            if (r12 == 0) goto L6a
            long r11 = r11.length()     // Catch: java.lang.Throwable -> L3e
            r13 = 1
            int r13 = (r13 > r11 ? 1 : (r13 == r11 ? 0 : -1))
            if (r13 > 0) goto L6a
            int r11 = (r11 > r2 ? 1 : (r11 == r2 ? 0 : -1))
            if (r11 >= 0) goto L6a
            r2 = r10
        L8b:
            boolean r0 = r1.f1481g     // Catch: java.lang.Throwable -> L3e
            r3 = 16
            r11 = 4
            if (r0 == 0) goto L95
            java.lang.String r0 = "verifying"
            goto Le5
        L95:
            boolean r0 = r1.f1482h     // Catch: java.lang.Throwable -> L3e
            if (r0 == 0) goto L9c
            java.lang.String r0 = "ready"
            goto Le5
        L9c:
            java.lang.String r0 = r1.f1484j     // Catch: java.lang.Throwable -> L3e
            if (r0 == 0) goto La3
            java.lang.String r0 = "failed"
            goto Le5
        La3:
            if (r8 == 0) goto La8
            java.lang.String r0 = "downloaded"
            goto Le5
        La8:
            boolean r0 = p137u3.n.c(r5)     // Catch: java.lang.Throwable -> L3e
            if (r0 == 0) goto Lb1
            java.lang.String r0 = "failed"
            goto Le5
        Lb1:
            if (r7 == 0) goto Lbd
            int r0 = r7.e()     // Catch: java.lang.Throwable -> L3e
            r12 = 2
            if (r0 != r12) goto Lbd
            java.lang.String r0 = "downloading"
            goto Le5
        Lbd:
            if (r7 == 0) goto Lc8
            int r0 = r7.e()     // Catch: java.lang.Throwable -> L3e
            if (r0 != r10) goto Lc8
            java.lang.String r0 = "queued"
            goto Le5
        Lc8:
            if (r7 == 0) goto Ld3
            int r0 = r7.e()     // Catch: java.lang.Throwable -> L3e
            if (r0 != r11) goto Ld3
            java.lang.String r0 = "waiting"
            goto Le5
        Ld3:
            if (r7 == 0) goto Lde
            int r0 = r7.e()     // Catch: java.lang.Throwable -> L3e
            if (r0 != r3) goto Lde
            java.lang.String r0 = "failed"
            goto Le5
        Lde:
            if (r2 == 0) goto Le3
            java.lang.String r0 = "legacy-partial"
            goto Le5
        Le3:
            java.lang.String r0 = "not-installed"
        Le5:
            java.lang.String r12 = "state"
            kotlin.Pair r13 = p137u3.s.a(r12, r0)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "cached"
            if (r8 == 0) goto Lf1
            r12 = r10
            goto Lf2
        Lf1:
            r12 = r9
        Lf2:
            java.lang.Boolean r12 = java.lang.Boolean.valueOf(r12)     // Catch: java.lang.Throwable -> L3e
            kotlin.Pair r14 = p137u3.s.a(r0, r12)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "verified"
            boolean r12 = r1.f1482h     // Catch: java.lang.Throwable -> L3e
            java.lang.Boolean r12 = java.lang.Boolean.valueOf(r12)     // Catch: java.lang.Throwable -> L3e
            kotlin.Pair r15 = p137u3.s.a(r0, r12)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "receivedBytes"
            boolean r12 = r1.f1481g     // Catch: java.lang.Throwable -> L3e
            if (r12 == 0) goto L115
            r16 = r7
            long r6 = r1.f1483i     // Catch: java.lang.Throwable -> L3e
        L110:
            java.lang.Long r6 = java.lang.Long.valueOf(r6)     // Catch: java.lang.Throwable -> L3e
            goto L123
        L115:
            r16 = r7
            if (r8 == 0) goto L11b
            r6 = r4
            goto L123
        L11b:
            if (r16 == 0) goto L122
            long r6 = r16.d()     // Catch: java.lang.Throwable -> L3e
            goto L110
        L122:
            r6 = 0
        L123:
            kotlin.Pair r6 = p137u3.s.a(r0, r6)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "totalBytes"
            kotlin.Pair r17 = p137u3.s.a(r0, r4)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r4 = "freeBytes"
            u3.n$a r0 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L149
            android.os.StatFs r0 = new android.os.StatFs     // Catch: java.lang.Throwable -> L149
            java.io.File r7 = r1.f1477c     // Catch: java.lang.Throwable -> L149
            java.lang.String r7 = r7.getPath()     // Catch: java.lang.Throwable -> L149
            r0.<init>(r7)     // Catch: java.lang.Throwable -> L149
            long r18 = r0.getAvailableBytes()     // Catch: java.lang.Throwable -> L149
            java.lang.Long r0 = java.lang.Long.valueOf(r18)     // Catch: java.lang.Throwable -> L149
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L149
            goto L154
        L149:
            r0 = move-exception
            u3.n$a r7 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L3e
            java.lang.Object r0 = p137u3.o.a(r0)     // Catch: java.lang.Throwable -> L3e
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L3e
        L154:
            boolean r7 = p137u3.n.c(r0)     // Catch: java.lang.Throwable -> L3e
            if (r7 == 0) goto L15b
            r0 = 0
        L15b:
            kotlin.Pair r18 = p137u3.s.a(r4, r0)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "requiredFreeBytes"
            r19 = 898530688(0x358e7d80, double:4.439331447E-315)
            java.lang.Long r4 = java.lang.Long.valueOf(r19)     // Catch: java.lang.Throwable -> L3e
            kotlin.Pair r19 = p137u3.s.a(r0, r4)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "backgroundOwned"
            if (r16 == 0) goto L17d
            K5.A0$a r4 = K5.A0.f1473k     // Catch: java.lang.Throwable -> L3e
            int r7 = r16.e()     // Catch: java.lang.Throwable -> L3e
            boolean r4 = r4.a(r7)     // Catch: java.lang.Throwable -> L3e
            if (r4 == 0) goto L17d
            r9 = r10
        L17d:
            java.lang.Boolean r4 = java.lang.Boolean.valueOf(r9)     // Catch: java.lang.Throwable -> L3e
            kotlin.Pair r20 = p137u3.s.a(r0, r4)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "reason"
            java.lang.String r4 = r1.f1484j     // Catch: java.lang.Throwable -> L3e
            if (r4 != 0) goto L1b7
            boolean r4 = p137u3.n.c(r5)     // Catch: java.lang.Throwable -> L3e
            if (r4 == 0) goto L196
            if (r8 != 0) goto L196
            java.lang.String r4 = "DOWNLOAD_SERVICE_UNAVAILABLE"
            goto L1b7
        L196:
            if (r16 == 0) goto L1b6
            int r4 = r16.e()     // Catch: java.lang.Throwable -> L3e
            if (r4 == r11) goto L1a7
            int r4 = r16.e()     // Catch: java.lang.Throwable -> L3e
            if (r4 != r3) goto L1a5
            goto L1a7
        L1a5:
            r7 = 0
            goto L1a9
        L1a7:
            r7 = r16
        L1a9:
            if (r7 == 0) goto L1b6
            K5.A0$a r3 = K5.A0.f1473k     // Catch: java.lang.Throwable -> L3e
            int r4 = r7.c()     // Catch: java.lang.Throwable -> L3e
            java.lang.String r4 = r3.c(r4)     // Catch: java.lang.Throwable -> L3e
            goto L1b7
        L1b6:
            r4 = 0
        L1b7:
            kotlin.Pair r21 = p137u3.s.a(r0, r4)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "legacyPartial"
            java.lang.Boolean r2 = java.lang.Boolean.valueOf(r2)     // Catch: java.lang.Throwable -> L3e
            kotlin.Pair r22 = p137u3.s.a(r0, r2)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r0 = "path"
            boolean r2 = r1.f1482h     // Catch: java.lang.Throwable -> L3e
            if (r2 == 0) goto L1d6
            java.io.File r2 = r1.f1478d     // Catch: java.lang.Throwable -> L3e
            android.net.Uri r2 = android.net.Uri.fromFile(r2)     // Catch: java.lang.Throwable -> L3e
            java.lang.String r2 = r2.toString()     // Catch: java.lang.Throwable -> L3e
            goto L1d7
        L1d6:
            r2 = 0
        L1d7:
            kotlin.Pair r23 = p137u3.s.a(r0, r2)     // Catch: java.lang.Throwable -> L3e
            r16 = r6
            kotlin.Pair[] r0 = new kotlin.Pair[]{r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23}     // Catch: java.lang.Throwable -> L3e
            java.util.Map r0 = p143v3.L.l(r0)     // Catch: java.lang.Throwable -> L3e
            monitor-exit(r24)
            return r0
        L1e7:
            monitor-exit(r24)     // Catch: java.lang.Throwable -> L3e
            throw r0
    }

    public final synchronized java.util.Map p() {
            r7 = this;
            monitor-enter(r7)
            java.util.concurrent.atomic.AtomicBoolean r0 = r7.f1480f     // Catch: java.lang.Throwable -> L31
            r1 = 1
            r0.set(r1)     // Catch: java.lang.Throwable -> L31
            java.util.List r0 = r7.i()     // Catch: java.lang.Throwable -> L31
            java.util.ArrayList r2 = new java.util.ArrayList     // Catch: java.lang.Throwable -> L31
            r2.<init>()     // Catch: java.lang.Throwable -> L31
            java.util.Iterator r0 = r0.iterator()     // Catch: java.lang.Throwable -> L31
        L14:
            boolean r3 = r0.hasNext()     // Catch: java.lang.Throwable -> L31
            if (r3 == 0) goto L33
            java.lang.Object r3 = r0.next()     // Catch: java.lang.Throwable -> L31
            r4 = r3
            K5.A0$b r4 = (K5.A0.b) r4     // Catch: java.lang.Throwable -> L31
            K5.A0$a r5 = K5.A0.f1473k     // Catch: java.lang.Throwable -> L31
            int r4 = r4.e()     // Catch: java.lang.Throwable -> L31
            boolean r4 = r5.a(r4)     // Catch: java.lang.Throwable -> L31
            if (r4 == 0) goto L14
            r2.add(r3)     // Catch: java.lang.Throwable -> L31
            goto L14
        L31:
            r0 = move-exception
            goto L5d
        L33:
            java.util.Iterator r0 = r2.iterator()     // Catch: java.lang.Throwable -> L31
        L37:
            boolean r2 = r0.hasNext()     // Catch: java.lang.Throwable -> L31
            if (r2 == 0) goto L54
            java.lang.Object r2 = r0.next()     // Catch: java.lang.Throwable -> L31
            K5.A0$b r2 = (K5.A0.b) r2     // Catch: java.lang.Throwable -> L31
            android.app.DownloadManager r3 = r7.g()     // Catch: java.lang.Throwable -> L31
            long r4 = r2.b()     // Catch: java.lang.Throwable -> L31
            long[] r2 = new long[r1]     // Catch: java.lang.Throwable -> L31
            r6 = 0
            r2[r6] = r4     // Catch: java.lang.Throwable -> L31
            r3.remove(r2)     // Catch: java.lang.Throwable -> L31
            goto L37
        L54:
            r0 = 0
            r7.f1484j = r0     // Catch: java.lang.Throwable -> L31
            java.util.Map r0 = r7.o()     // Catch: java.lang.Throwable -> L31
            monitor-exit(r7)
            return r0
        L5d:
            monitor-exit(r7)     // Catch: java.lang.Throwable -> L31
            throw r0
    }

    public final java.util.Map q(kotlin.jvm.functions.Function1 r12) {
            r11 = this;
            java.lang.String r0 = "progress"
            J3.l.f(r12, r0)
            monitor-enter(r11)
            boolean r0 = r11.f1481g     // Catch: java.lang.Throwable -> L1ab
            if (r0 != 0) goto L1b6
            u3.n$a r0 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L15
            K5.A0$b r0 = r11.h()     // Catch: java.lang.Throwable -> L15
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L15
            goto L20
        L15:
            r0 = move-exception
            u3.n$a r1 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> L1ab
            java.lang.Object r0 = p137u3.o.a(r0)     // Catch: java.lang.Throwable -> L1ab
            java.lang.Object r0 = p137u3.n.a(r0)     // Catch: java.lang.Throwable -> L1ab
        L20:
            boolean r1 = p137u3.n.c(r0)     // Catch: java.lang.Throwable -> L1ab
            r2 = 0
            if (r1 == 0) goto L28
            r0 = r2
        L28:
            K5.A0$b r0 = (K5.A0.b) r0     // Catch: java.lang.Throwable -> L1ab
            java.io.File r4 = r11.e(r0)     // Catch: java.lang.Throwable -> L1ab
            if (r4 == 0) goto L1ae
            r0 = 1
            r11.f1481g = r0     // Catch: java.lang.Throwable -> L1ab
            r1 = 0
            r11.f1482h = r1     // Catch: java.lang.Throwable -> L1ab
            java.util.concurrent.atomic.AtomicBoolean r3 = r11.f1480f     // Catch: java.lang.Throwable -> L1ab
            r3.set(r1)     // Catch: java.lang.Throwable -> L1ab
            r5 = 0
            r11.f1483i = r5     // Catch: java.lang.Throwable -> L1ab
            r11.f1484j = r2     // Catch: java.lang.Throwable -> L1ab
            u3.A r3 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> L1ab
            monitor-exit(r11)
            java.io.File r3 = r4.getCanonicalFile()
            java.io.File r5 = r11.f1478d
            java.io.File r5 = r5.getCanonicalFile()
            boolean r3 = J3.l.b(r3, r5)
            if (r3 == 0) goto L56
        L54:
            r5 = r2
            goto L60
        L56:
            java.io.File r2 = new java.io.File
            java.io.File r3 = r11.f1477c
            java.lang.String r5 = "verified.partial"
            r2.<init>(r3, r5)
            goto L54
        L60:
            if (r5 == 0) goto L89
            android.os.StatFs r2 = new android.os.StatFs     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            java.io.File r3 = r11.f1477c     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            java.lang.String r3 = r3.getPath()     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            r2.<init>(r3)     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            long r2 = r2.getAvailableBytes()     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            r6 = 449265344(0x1ac73ec0, double:2.219665723E-315)
            int r2 = (r2 > r6 ? 1 : (r2 == r6 ? 0 : -1))
            if (r2 < 0) goto L79
            goto L89
        L79:
            java.lang.String r12 = "INSUFFICIENT_SPACE"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            r0.<init>(r12)     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            throw r0     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
        L81:
            r0 = move-exception
            r12 = r0
            goto L1a0
        L85:
            r0 = move-exception
            r12 = r0
            goto L16e
        L89:
            K5.C0 r3 = K5.C0.f1490a     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            java.lang.String r8 = "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb"
            java.util.concurrent.atomic.AtomicBoolean r9 = r11.f1480f     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            K5.z0 r10 = new K5.z0     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            r10.<init>(r11, r12)     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            r6 = 382156480(0x16c73ec0, double:1.88810388E-315)
            r3.b(r4, r5, r6, r8, r9, r10)     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            monitor-enter(r11)     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            java.util.concurrent.atomic.AtomicBoolean r12 = r11.f1480f     // Catch: java.lang.Throwable -> Lbe
            boolean r12 = r12.get()     // Catch: java.lang.Throwable -> Lbe
            if (r12 != 0) goto L164
            if (r5 == 0) goto Lc2
            java.nio.file.Path r12 = r5.toPath()     // Catch: java.lang.Throwable -> Lbe
            java.io.File r2 = r11.f1478d     // Catch: java.lang.Throwable -> Lbe
            java.nio.file.Path r2 = r2.toPath()     // Catch: java.lang.Throwable -> Lbe
            r3 = 2
            java.nio.file.CopyOption[] r3 = new java.nio.file.CopyOption[r3]     // Catch: java.lang.Throwable -> Lbe
            java.nio.file.StandardCopyOption r6 = java.nio.file.StandardCopyOption.ATOMIC_MOVE     // Catch: java.lang.Throwable -> Lbe
            r3[r1] = r6     // Catch: java.lang.Throwable -> Lbe
            java.nio.file.StandardCopyOption r6 = java.nio.file.StandardCopyOption.REPLACE_EXISTING     // Catch: java.lang.Throwable -> Lbe
            r3[r0] = r6     // Catch: java.lang.Throwable -> Lbe
            java.nio.file.Files.move(r12, r2, r3)     // Catch: java.lang.Throwable -> Lbe
            goto Lc2
        Lbe:
            r0 = move-exception
            r12 = r0
            goto L16c
        Lc2:
            android.util.AtomicFile r12 = new android.util.AtomicFile     // Catch: java.lang.Throwable -> Lbe
            java.io.File r2 = r11.f1479e     // Catch: java.lang.Throwable -> Lbe
            r12.<init>(r2)     // Catch: java.lang.Throwable -> Lbe
            java.io.FileOutputStream r2 = r12.startWrite()     // Catch: java.lang.Throwable -> Lbe
            org.json.JSONObject r3 = new org.json.JSONObject     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            r3.<init>()     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            java.lang.String r6 = "path"
            java.io.File r7 = r11.f1478d     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            android.net.Uri r7 = android.net.Uri.fromFile(r7)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            java.lang.String r7 = r7.toString()     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            org.json.JSONObject r3 = r3.put(r6, r7)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            java.lang.String r6 = "checksum"
            java.lang.String r7 = "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb"
            org.json.JSONObject r3 = r3.put(r6, r7)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            java.lang.String r3 = r3.toString()     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            java.lang.String r6 = "toString(...)"
            J3.l.e(r3, r6)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            java.nio.charset.Charset r6 = p027d5.C0929d.f11148b     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            byte[] r3 = r3.getBytes(r6)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            java.lang.String r6 = "getBytes(...)"
            J3.l.e(r3, r6)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            r2.write(r3)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            r12.finishWrite(r2)     // Catch: java.lang.Throwable -> Lbe java.lang.Exception -> L15f
            r11.f1482h = r0     // Catch: java.lang.Throwable -> Lbe
            java.util.List r12 = r11.i()     // Catch: java.lang.Throwable -> L12a
            java.util.Iterator r12 = r12.iterator()     // Catch: java.lang.Throwable -> L12a
        L10e:
            boolean r2 = r12.hasNext()     // Catch: java.lang.Throwable -> L12a
            if (r2 == 0) goto L12d
            java.lang.Object r2 = r12.next()     // Catch: java.lang.Throwable -> L12a
            K5.A0$b r2 = (K5.A0.b) r2     // Catch: java.lang.Throwable -> L12a
            android.app.DownloadManager r3 = r11.g()     // Catch: java.lang.Throwable -> L12a
            long r6 = r2.b()     // Catch: java.lang.Throwable -> L12a
            long[] r2 = new long[r0]     // Catch: java.lang.Throwable -> L12a
            r2[r1] = r6     // Catch: java.lang.Throwable -> L12a
            r3.remove(r2)     // Catch: java.lang.Throwable -> L12a
            goto L10e
        L12a:
            r0 = move-exception
            r12 = r0
            goto L133
        L12d:
            u3.A r12 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> L12a
            p137u3.n.a(r12)     // Catch: java.lang.Throwable -> L12a
            goto L13c
        L133:
            u3.n$a r0 = p137u3.n.f16184f     // Catch: java.lang.Throwable -> Lbe
            java.lang.Object r12 = p137u3.o.a(r12)     // Catch: java.lang.Throwable -> Lbe
            p137u3.n.a(r12)     // Catch: java.lang.Throwable -> Lbe
        L13c:
            java.io.File r12 = r4.getCanonicalFile()     // Catch: java.lang.Throwable -> Lbe
            java.io.File r0 = r11.f1478d     // Catch: java.lang.Throwable -> Lbe
            java.io.File r0 = r0.getCanonicalFile()     // Catch: java.lang.Throwable -> Lbe
            boolean r12 = J3.l.b(r12, r0)     // Catch: java.lang.Throwable -> Lbe
            if (r12 != 0) goto L14f
            r4.delete()     // Catch: java.lang.Throwable -> Lbe
        L14f:
            u3.A r12 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> Lbe
            monitor-exit(r11)     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            monitor-enter(r11)
            r11.f1481g = r1     // Catch: java.lang.Throwable -> L15b
            monitor-exit(r11)
            java.util.Map r11 = r11.o()
            return r11
        L15b:
            r0 = move-exception
            r12 = r0
            monitor-exit(r11)
            throw r12
        L15f:
            r0 = move-exception
            r12.failWrite(r2)     // Catch: java.lang.Throwable -> Lbe
            throw r0     // Catch: java.lang.Throwable -> Lbe
        L164:
            java.lang.String r12 = "CANCELLED"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> Lbe
            r0.<init>(r12)     // Catch: java.lang.Throwable -> Lbe
            throw r0     // Catch: java.lang.Throwable -> Lbe
        L16c:
            monitor-exit(r11)     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
            throw r12     // Catch: java.lang.Throwable -> L81 java.lang.Exception -> L85
        L16e:
            monitor-enter(r11)     // Catch: java.lang.Throwable -> L81
            java.lang.String r0 = "CANCELLED"
            java.lang.String r2 = "MODEL_SIZE_MISMATCH"
            java.lang.String r3 = "MODEL_INTEGRITY_FAILED"
            java.lang.String r4 = "INSUFFICIENT_SPACE"
            java.lang.String[] r0 = new java.lang.String[]{r0, r2, r3, r4}     // Catch: java.lang.Throwable -> L18e
            java.util.Set r0 = p143v3.U.h(r0)     // Catch: java.lang.Throwable -> L18e
            java.lang.String r2 = r12.getMessage()     // Catch: java.lang.Throwable -> L18e
            boolean r0 = p143v3.AbstractC1216q.T(r0, r2)     // Catch: java.lang.Throwable -> L18e
            if (r0 == 0) goto L191
            java.lang.String r0 = r12.getMessage()     // Catch: java.lang.Throwable -> L18e
            goto L193
        L18e:
            r0 = move-exception
            r12 = r0
            goto L19e
        L191:
            java.lang.String r0 = "MODEL_VERIFY_FAILED"
        L193:
            r11.f1484j = r0     // Catch: java.lang.Throwable -> L18e
            u3.A r0 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> L18e
            monitor-exit(r11)     // Catch: java.lang.Throwable -> L81
            if (r5 == 0) goto L19d
            r5.delete()     // Catch: java.lang.Throwable -> L81
        L19d:
            throw r12     // Catch: java.lang.Throwable -> L81
        L19e:
            monitor-exit(r11)     // Catch: java.lang.Throwable -> L81
            throw r12     // Catch: java.lang.Throwable -> L81
        L1a0:
            monitor-enter(r11)
            r11.f1481g = r1     // Catch: java.lang.Throwable -> L1a7
            u3.A r0 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> L1a7
            monitor-exit(r11)
            throw r12
        L1a7:
            r0 = move-exception
            r12 = r0
            monitor-exit(r11)
            throw r12
        L1ab:
            r0 = move-exception
            r12 = r0
            goto L1be
        L1ae:
            java.lang.IllegalStateException r12 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L1ab
            java.lang.String r0 = "MODEL_NOT_DOWNLOADED"
            r12.<init>(r0)     // Catch: java.lang.Throwable -> L1ab
            throw r12     // Catch: java.lang.Throwable -> L1ab
        L1b6:
            java.lang.String r12 = "VERIFY_BUSY"
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException     // Catch: java.lang.Throwable -> L1ab
            r0.<init>(r12)     // Catch: java.lang.Throwable -> L1ab
            throw r0     // Catch: java.lang.Throwable -> L1ab
        L1be:
            monitor-exit(r11)
            throw r12
    }
}
