package L5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class p {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final L5.p f1844a = null;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private static final java.lang.String[] f1845b = null;

    public static final class a {

        /* JADX INFO: renamed from: a, reason: collision with root package name */
        private final java.util.concurrent.atomic.AtomicBoolean f1846a;

        /* JADX INFO: renamed from: b, reason: collision with root package name */
        private final android.os.CancellationSignal f1847b;

        /* JADX INFO: renamed from: c, reason: collision with root package name */
        private volatile java.io.InputStream f1848c;

        public a() {
                r2 = this;
                r2.<init>()
                java.util.concurrent.atomic.AtomicBoolean r0 = new java.util.concurrent.atomic.AtomicBoolean
                r1 = 0
                r0.<init>(r1)
                r2.f1846a = r0
                android.os.CancellationSignal r0 = new android.os.CancellationSignal
                r0.<init>()
                r2.f1847b = r0
                return
        }

        public final void a(java.io.InputStream r2) {
                r1 = this;
                java.lang.String r0 = "stream"
                J3.l.f(r2, r0)
                r1.f1848c = r2
                java.util.concurrent.atomic.AtomicBoolean r1 = r1.f1846a
                boolean r1 = r1.get()
                if (r1 != 0) goto L10
                return
            L10:
                r2.close()
                java.lang.IllegalStateException r1 = new java.lang.IllegalStateException
                java.lang.String r2 = "CANCELLED"
                r1.<init>(r2)
                throw r1
        }

        public final void b() {
                r2 = this;
                java.util.concurrent.atomic.AtomicBoolean r0 = r2.f1846a
                r1 = 1
                r0.set(r1)
                android.os.CancellationSignal r0 = r2.f1847b
                r0.cancel()
                java.io.InputStream r2 = r2.f1848c     // Catch: java.lang.Exception -> L12
                if (r2 == 0) goto L12
                r2.close()     // Catch: java.lang.Exception -> L12
            L12:
                return
        }

        public final void c() {
                r1 = this;
                java.util.concurrent.atomic.AtomicBoolean r1 = r1.f1846a
                boolean r1 = r1.get()
                if (r1 != 0) goto L9
                return
            L9:
                java.lang.IllegalStateException r1 = new java.lang.IllegalStateException
                java.lang.String r0 = "CANCELLED"
                r1.<init>(r0)
                throw r1
        }

        public final android.os.CancellationSignal d() {
                r0 = this;
                android.os.CancellationSignal r0 = r0.f1847b
                return r0
        }

        public final void e() {
                r1 = this;
                java.io.InputStream r0 = r1.f1848c     // Catch: java.lang.Exception -> L7
                if (r0 == 0) goto L7
                r0.close()     // Catch: java.lang.Exception -> L7
            L7:
                r0 = 0
                r1.f1848c = r0
                return
        }
    }

    static {
            L5.p r0 = new L5.p
            r0.<init>()
            L5.p.f1844a = r0
            java.lang.String r0 = "image/jpeg"
            java.lang.String r1 = "text/plain"
            java.lang.String r2 = "application/pdf"
            java.lang.String r3 = "image/png"
            java.lang.String[] r0 = new java.lang.String[]{r2, r3, r0, r1}
            L5.p.f1845b = r0
            return
    }

    private p() {
            r0 = this;
            r0.<init>()
            return
    }

    public static /* synthetic */ java.lang.CharSequence a(byte r0) {
            java.lang.CharSequence r0 = h(r0)
            return r0
    }

    private final boolean f(byte[] r3, int[] r4) {
            r2 = this;
            int r2 = r3.length
            int r0 = r4.length
            if (r2 < r0) goto L32
            P3.c r2 = p143v3.AbstractC1209j.H(r4)
            boolean r0 = r2 instanceof java.util.Collection
            if (r0 == 0) goto L16
            r0 = r2
            java.util.Collection r0 = (java.util.Collection) r0
            boolean r0 = r0.isEmpty()
            if (r0 == 0) goto L16
            goto L30
        L16:
            java.util.Iterator r2 = r2.iterator()
        L1a:
            boolean r0 = r2.hasNext()
            if (r0 == 0) goto L30
            r0 = r2
            v3.J r0 = (p143v3.J) r0
            int r0 = r0.nextInt()
            r1 = r3[r0]
            r1 = r1 & 255(0xff, float:3.57E-43)
            r0 = r4[r0]
            if (r1 != r0) goto L32
            goto L1a
        L30:
            r2 = 1
            return r2
        L32:
            r2 = 0
            return r2
    }

    private static final java.lang.CharSequence h(byte r1) {
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

    public final java.lang.String b(java.lang.String r3) {
            r2 = this;
            java.lang.String r2 = "Supporting file"
            if (r3 != 0) goto L5
            r3 = r2
        L5:
            d5.o r0 = new d5.o
            java.lang.String r1 = "[/\\\\\\x00-\\x1f\\x7f\\u202a-\\u202e\\u2066-\\u2069]"
            r0.<init>(r1)
            java.lang.String r1 = "_"
            java.lang.String r3 = r0.f(r3, r1)
            java.lang.CharSequence r3 = p027d5.q.Y0(r3)
            java.lang.String r3 = r3.toString()
            r0 = 160(0xa0, float:2.24E-43)
            java.lang.String r3 = p027d5.q.g1(r3, r0)
            boolean r0 = p027d5.q.d0(r3)
            if (r0 != 0) goto L38
            java.lang.String r0 = "."
            boolean r0 = J3.l.b(r3, r0)
            if (r0 != 0) goto L38
            java.lang.String r0 = ".."
            boolean r0 = J3.l.b(r3, r0)
            if (r0 == 0) goto L37
            goto L38
        L37:
            return r3
        L38:
            return r2
    }

    public final java.lang.String[] c() {
            r0 = this;
            java.lang.String[] r0 = L5.p.f1845b
            return r0
    }

    public final java.lang.String d(byte[] r10) {
            r9 = this;
            java.lang.String r0 = "bytes"
            J3.l.f(r10, r0)
            int r0 = r10.length
            r1 = 0
            if (r0 != 0) goto Lb
            r0 = 1
            goto Lc
        Lb:
            r0 = r1
        Lc:
            if (r0 != 0) goto L13a
            int r0 = r10.length
            r2 = 1048576(0x100000, float:1.469368E-39)
            if (r0 > r2) goto L13a
            r0 = 8
            int[] r0 = new int[r0]
            r0 = {x0142: FILL_ARRAY_DATA , data: [137, 80, 78, 71, 13, 10, 26, 10} // fill-array
            boolean r0 = r9.f(r10, r0)
            r2 = 12
            r3 = 45
            r4 = 255(0xff, float:3.57E-43)
            java.lang.String r5 = "ATTACHMENT_TYPE"
            if (r0 == 0) goto L67
            int[] r9 = new int[r2]
            r9 = {x0156: FILL_ARRAY_DATA , data: [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130} // fill-array
            int r0 = r10.length
            if (r0 < r3) goto L61
            P3.c r0 = p143v3.AbstractC1209j.H(r9)
            boolean r1 = r0 instanceof java.util.Collection
            if (r1 == 0) goto L42
            r1 = r0
            java.util.Collection r1 = (java.util.Collection) r1
            boolean r1 = r1.isEmpty()
            if (r1 == 0) goto L42
            goto L5e
        L42:
            java.util.Iterator r0 = r0.iterator()
        L46:
            boolean r1 = r0.hasNext()
            if (r1 == 0) goto L5e
            r1 = r0
            v3.J r1 = (p143v3.J) r1
            int r1 = r1.nextInt()
            int r3 = r10.length
            int r3 = r3 - r2
            int r3 = r3 + r1
            r3 = r10[r3]
            r3 = r3 & r4
            r1 = r9[r1]
            if (r3 != r1) goto L61
            goto L46
        L5e:
            java.lang.String r9 = "image/png"
            return r9
        L61:
            java.lang.IllegalArgumentException r9 = new java.lang.IllegalArgumentException
            r9.<init>(r5)
            throw r9
        L67:
            r0 = 216(0xd8, float:3.03E-43)
            int[] r0 = new int[]{r4, r0, r4}
            boolean r0 = r9.f(r10, r0)
            r4 = 2
            if (r0 == 0) goto L90
            int r9 = r10.length
            r0 = 4
            if (r9 < r0) goto L8a
            int r9 = r10.length
            int r9 = r9 - r4
            r9 = r10[r9]
            r0 = -1
            if (r9 != r0) goto L8a
            byte r9 = p143v3.AbstractC1209j.c0(r10)
            r10 = -39
            if (r9 != r10) goto L8a
            java.lang.String r9 = "image/jpeg"
            return r9
        L8a:
            java.lang.IllegalArgumentException r9 = new java.lang.IllegalArgumentException
            r9.<init>(r5)
            throw r9
        L90:
            r0 = 37
            r6 = 70
            r7 = 80
            r8 = 68
            int[] r0 = new int[]{r0, r7, r8, r6, r3}
            boolean r9 = r9.f(r10, r0)
            if (r9 == 0) goto Lec
            java.lang.String r9 = new java.lang.String
            int r0 = r10.length
            r3 = 1024(0x400, float:1.435E-42)
            int r0 = r0 - r3
            int r0 = java.lang.Math.max(r1, r0)
            int r1 = r10.length
            int r1 = java.lang.Math.min(r1, r3)
            java.nio.charset.Charset r3 = p027d5.C0929d.f11153g
            r9.<init>(r10, r0, r1, r3)
            int r0 = r10.length
            if (r0 < r2) goto Le6
            r0 = 5
            r0 = r10[r0]
            r1 = 49
            if (r1 > r0) goto Le6
            r1 = 51
            if (r0 >= r1) goto Le6
            r0 = 6
            r0 = r10[r0]
            r1 = 46
            if (r0 != r1) goto Le6
            r0 = 7
            r10 = r10[r0]
            r0 = 48
            if (r0 > r10) goto Le6
            r0 = 58
            if (r10 >= r0) goto Le6
            d5.o r10 = new d5.o
            java.lang.String r0 = "%%EOF[\\t\\r\\n ]*$"
            r10.<init>(r0)
            boolean r9 = r10.a(r9)
            if (r9 == 0) goto Le6
            java.lang.String r9 = "application/pdf"
            return r9
        Le6:
            java.lang.IllegalArgumentException r9 = new java.lang.IllegalArgumentException
            r9.<init>(r5)
            throw r9
        Lec:
            java.nio.charset.Charset r9 = p027d5.C0929d.f11148b     // Catch: java.lang.Exception -> L134
            java.nio.charset.CharsetDecoder r9 = r9.newDecoder()     // Catch: java.lang.Exception -> L134
            java.nio.charset.CodingErrorAction r0 = java.nio.charset.CodingErrorAction.REPORT     // Catch: java.lang.Exception -> L134
            java.nio.charset.CharsetDecoder r9 = r9.onMalformedInput(r0)     // Catch: java.lang.Exception -> L134
            java.nio.charset.CharsetDecoder r9 = r9.onUnmappableCharacter(r0)     // Catch: java.lang.Exception -> L134
            java.nio.ByteBuffer r10 = java.nio.ByteBuffer.wrap(r10)     // Catch: java.lang.Exception -> L134
            java.nio.CharBuffer r9 = r9.decode(r10)     // Catch: java.lang.Exception -> L134
            J3.l.c(r9)
            r10 = r1
        L108:
            int r0 = r9.length()
            if (r10 >= r0) goto L131
            char r0 = r9.charAt(r10)
            r2 = 32
            if (r0 >= r2) goto L11f
            java.lang.String r2 = "\t\r\n"
            r3 = 0
            boolean r2 = p027d5.q.N(r2, r0, r1, r4, r3)
            if (r2 == 0) goto L128
        L11f:
            r2 = 127(0x7f, float:1.78E-43)
            if (r2 > r0) goto L12e
            r2 = 160(0xa0, float:2.24E-43)
            if (r0 < r2) goto L128
            goto L12e
        L128:
            java.lang.IllegalArgumentException r9 = new java.lang.IllegalArgumentException
            r9.<init>(r5)
            throw r9
        L12e:
            int r10 = r10 + 1
            goto L108
        L131:
            java.lang.String r9 = "text/plain"
            return r9
        L134:
            java.lang.IllegalStateException r9 = new java.lang.IllegalStateException
            r9.<init>(r5)
            throw r9
        L13a:
            java.lang.IllegalArgumentException r9 = new java.lang.IllegalArgumentException
            java.lang.String r10 = "ATTACHMENT_SIZE"
            r9.<init>(r10)
            throw r9
    }

    public final java.util.Map e(android.content.Context r12, android.net.Uri r13, L5.p.a r14) {
            r11 = this;
            java.lang.String r11 = "context"
            J3.l.f(r12, r11)
            java.lang.String r11 = "uri"
            J3.l.f(r13, r11)
            java.lang.String r11 = "request"
            J3.l.f(r14, r11)
            java.lang.String r11 = r13.getScheme()
            java.lang.String r0 = "content"
            boolean r11 = J3.l.b(r11, r0)
            if (r11 == 0) goto L149
            r14.c()
            android.content.ContentResolver r0 = r12.getContentResolver()
            java.lang.String r11 = "_display_name"
            java.lang.String r7 = "_size"
            java.lang.String[] r2 = new java.lang.String[]{r11, r7}
            r5 = 0
            android.os.CancellationSignal r6 = r14.d()
            r3 = 0
            r4 = 0
            r1 = r13
            android.database.Cursor r13 = r0.query(r1, r2, r3, r4, r5, r6)
            java.lang.String r0 = "ATTACHMENT_SIZE"
            r2 = 0
            if (r13 == 0) goto L82
            boolean r3 = r13.moveToFirst()     // Catch: java.lang.Throwable -> L50
            if (r3 == 0) goto L74
            int r11 = r13.getColumnIndex(r11)     // Catch: java.lang.Throwable -> L50
            int r3 = r13.getColumnIndex(r7)     // Catch: java.lang.Throwable -> L50
            if (r11 < 0) goto L53
            java.lang.String r11 = r13.getString(r11)     // Catch: java.lang.Throwable -> L50
            goto L54
        L50:
            r0 = move-exception
            r11 = r0
            goto L7b
        L53:
            r11 = r2
        L54:
            if (r3 < 0) goto L75
            boolean r4 = r13.isNull(r3)     // Catch: java.lang.Throwable -> L50
            if (r4 != 0) goto L75
            long r3 = r13.getLong(r3)     // Catch: java.lang.Throwable -> L50
            r5 = 1
            int r5 = (r5 > r3 ? 1 : (r5 == r3 ? 0 : -1))
            if (r5 > 0) goto L6e
            r5 = 1048577(0x100001, double:5.18066E-318)
            int r3 = (r3 > r5 ? 1 : (r3 == r5 ? 0 : -1))
            if (r3 >= 0) goto L6e
            goto L75
        L6e:
            java.lang.IllegalArgumentException r11 = new java.lang.IllegalArgumentException     // Catch: java.lang.Throwable -> L50
            r11.<init>(r0)     // Catch: java.lang.Throwable -> L50
            throw r11     // Catch: java.lang.Throwable -> L50
        L74:
            r11 = r2
        L75:
            u3.A r3 = p137u3.A.f16167a     // Catch: java.lang.Throwable -> L50
            F3.c.a(r13, r2)
            goto L83
        L7b:
            throw r11     // Catch: java.lang.Throwable -> L7c
        L7c:
            r0 = move-exception
            r12 = r0
            F3.c.a(r13, r11)
            throw r12
        L82:
            r11 = r2
        L83:
            android.content.ContentResolver r13 = r12.getContentResolver()
            java.lang.String r13 = r13.getType(r1)
            r3 = 1048577(0x100001, float:1.46937E-39)
            byte[] r4 = new byte[r3]
            android.content.ContentResolver r12 = r12.getContentResolver()     // Catch: java.lang.Throwable -> L130
            java.lang.String r5 = "r"
            android.os.CancellationSignal r6 = r14.d()     // Catch: java.lang.Throwable -> L130
            android.os.ParcelFileDescriptor r12 = r12.openFileDescriptor(r1, r5, r6)     // Catch: java.lang.Throwable -> L130
            if (r12 == 0) goto L121
            java.io.FileInputStream r1 = new java.io.FileInputStream     // Catch: java.lang.Throwable -> L11e
            java.io.FileDescriptor r5 = r12.getFileDescriptor()     // Catch: java.lang.Throwable -> L11e
            r1.<init>(r5)     // Catch: java.lang.Throwable -> L11e
            r14.a(r1)     // Catch: java.lang.Throwable -> Lcc
            r5 = 0
        Lad:
            r14.c()     // Catch: java.lang.Throwable -> Lcc
            r6 = 65536(0x10000, float:9.18355E-41)
            int r7 = r3 - r5
            int r6 = java.lang.Math.min(r6, r7)     // Catch: java.lang.Throwable -> Lcc
            int r6 = r1.read(r4, r5, r6)     // Catch: java.lang.Throwable -> Lcc
            if (r6 < 0) goto Lcf
            if (r6 == 0) goto Lad
            int r5 = r5 + r6
            r6 = 1048576(0x100000, float:1.469368E-39)
            if (r5 > r6) goto Lc6
            goto Lad
        Lc6:
            java.lang.IllegalArgumentException r11 = new java.lang.IllegalArgumentException     // Catch: java.lang.Throwable -> Lcc
            r11.<init>(r0)     // Catch: java.lang.Throwable -> Lcc
            throw r11     // Catch: java.lang.Throwable -> Lcc
        Lcc:
            r0 = move-exception
            r11 = r0
            goto L117
        Lcf:
            r14.c()     // Catch: java.lang.Throwable -> Lcc
            if (r5 <= 0) goto L111
            byte[] r3 = java.util.Arrays.copyOf(r4, r5)     // Catch: java.lang.Throwable -> Lcc
            java.lang.String r0 = "copyOf(...)"
            J3.l.e(r3, r0)     // Catch: java.lang.Throwable -> Lcc
            L5.p r0 = L5.p.f1844a     // Catch: java.lang.Throwable -> L10c
            J3.l.c(r3)     // Catch: java.lang.Throwable -> L10c
            java.util.Map r11 = r0.g(r3, r11, r13)     // Catch: java.lang.Throwable -> L10c
            r14.c()     // Catch: java.lang.Throwable -> L10c
            F3.c.a(r1, r2)     // Catch: java.lang.Throwable -> L107
            F3.c.a(r12, r2)     // Catch: java.lang.Throwable -> L102
            r14.e()
            r8 = 6
            r9 = 0
            r5 = 0
            r6 = 0
            r7 = 0
            p143v3.AbstractC1209j.o(r4, r5, r6, r7, r8, r9)
            r9 = 6
            r10 = 0
            r8 = 0
            r5 = r3
            p143v3.AbstractC1209j.o(r5, r6, r7, r8, r9, r10)
            return r11
        L102:
            r0 = move-exception
            r5 = r3
            r11 = r0
            r2 = r5
            goto L132
        L107:
            r0 = move-exception
            r5 = r3
            r11 = r0
            r2 = r5
            goto L129
        L10c:
            r0 = move-exception
            r5 = r3
            r11 = r0
            r2 = r5
            goto L117
        L111:
            java.lang.IllegalArgumentException r11 = new java.lang.IllegalArgumentException     // Catch: java.lang.Throwable -> Lcc
            r11.<init>(r0)     // Catch: java.lang.Throwable -> Lcc
            throw r11     // Catch: java.lang.Throwable -> Lcc
        L117:
            throw r11     // Catch: java.lang.Throwable -> L118
        L118:
            r0 = move-exception
            r13 = r0
            F3.c.a(r1, r11)     // Catch: java.lang.Throwable -> L11e
            throw r13     // Catch: java.lang.Throwable -> L11e
        L11e:
            r0 = move-exception
            r11 = r0
            goto L129
        L121:
            java.lang.String r11 = "ATTACHMENT_READ"
            java.lang.IllegalArgumentException r13 = new java.lang.IllegalArgumentException     // Catch: java.lang.Throwable -> L11e
            r13.<init>(r11)     // Catch: java.lang.Throwable -> L11e
            throw r13     // Catch: java.lang.Throwable -> L11e
        L129:
            throw r11     // Catch: java.lang.Throwable -> L12a
        L12a:
            r0 = move-exception
            r13 = r0
            F3.c.a(r12, r11)     // Catch: java.lang.Throwable -> L130
            throw r13     // Catch: java.lang.Throwable -> L130
        L130:
            r0 = move-exception
            r11 = r0
        L132:
            r14.e()
            r8 = 6
            r9 = 0
            r5 = 0
            r6 = 0
            r7 = 0
            p143v3.AbstractC1209j.o(r4, r5, r6, r7, r8, r9)
            if (r2 == 0) goto L148
            r9 = 6
            r10 = 0
            r6 = 0
            r7 = 0
            r8 = 0
            r5 = r2
            p143v3.AbstractC1209j.o(r5, r6, r7, r8, r9, r10)
        L148:
            throw r11
        L149:
            java.lang.IllegalArgumentException r11 = new java.lang.IllegalArgumentException
            java.lang.String r12 = "ATTACHMENT_URI"
            r11.<init>(r12)
            throw r11
    }

    public final java.util.Map g(byte[] r11, java.lang.String r12, java.lang.String r13) {
            r10 = this;
            java.lang.String r0 = "bytes"
            J3.l.f(r11, r0)
            java.lang.String r0 = r10.d(r11)
            if (r13 == 0) goto L2c
            java.lang.String r1 = "application/octet-stream"
            java.lang.String r2 = "*/*"
            java.lang.String[] r1 = new java.lang.String[]{r1, r2}
            java.util.List r1 = p143v3.AbstractC1216q.m(r1)
            boolean r1 = r1.contains(r13)
            if (r1 != 0) goto L2c
            boolean r13 = J3.l.b(r13, r0)
            if (r13 == 0) goto L24
            goto L2c
        L24:
            java.lang.IllegalArgumentException r10 = new java.lang.IllegalArgumentException
            java.lang.String r11 = "ATTACHMENT_TYPE"
            r10.<init>(r11)
            throw r10
        L2c:
            java.lang.String r13 = "filename"
            java.lang.String r10 = r10.b(r12)
            kotlin.Pair r10 = p137u3.s.a(r13, r10)
            java.lang.String r12 = "mimeType"
            kotlin.Pair r12 = p137u3.s.a(r12, r0)
            int r13 = r11.length
            java.lang.Integer r13 = java.lang.Integer.valueOf(r13)
            java.lang.String r0 = "byteLength"
            kotlin.Pair r13 = p137u3.s.a(r0, r13)
            java.lang.String r0 = "SHA-256"
            java.security.MessageDigest r0 = java.security.MessageDigest.getInstance(r0)
            byte[] r1 = r0.digest(r11)
            java.lang.String r0 = "digest(...)"
            J3.l.e(r1, r0)
            L5.o r7 = new L5.o
            r7.<init>()
            r8 = 30
            r9 = 0
            java.lang.String r2 = ""
            r3 = 0
            r4 = 0
            r5 = 0
            r6 = 0
            java.lang.String r0 = p143v3.AbstractC1209j.Z(r1, r2, r3, r4, r5, r6, r7, r8, r9)
            java.lang.String r1 = "sha256"
            kotlin.Pair r0 = p137u3.s.a(r1, r0)
            java.util.Base64$Encoder r1 = java.util.Base64.getEncoder()
            java.lang.String r11 = r1.encodeToString(r11)
            java.lang.String r1 = "contentBase64"
            kotlin.Pair r11 = p137u3.s.a(r1, r11)
            kotlin.Pair[] r10 = new kotlin.Pair[]{r10, r12, r13, r0, r11}
            java.util.Map r10 = p143v3.L.l(r10)
            return r10
    }
}
