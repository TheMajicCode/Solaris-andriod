package L5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class n {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final L5.n f1840a = null;

    private static final class a {

        /* JADX INFO: renamed from: a, reason: collision with root package name */
        private final java.lang.String f1841a;

        /* JADX INFO: renamed from: b, reason: collision with root package name */
        private int f1842b;

        /* JADX INFO: renamed from: c, reason: collision with root package name */
        private int f1843c;

        public a(java.lang.String r2) {
                r1 = this;
                java.lang.String r0 = "s"
                J3.l.f(r2, r0)
                r1.<init>()
                r1.f1841a = r2
                return
        }

        public final java.lang.Void a() {
                r1 = this;
                java.lang.IllegalArgumentException r1 = new java.lang.IllegalArgumentException
                java.lang.String r0 = "RECOVERY_INVALID"
                r1.<init>(r0)
                throw r1
        }

        public final void b(java.lang.String r8) {
                r7 = this;
                java.lang.String r0 = "t"
                J3.l.f(r8, r0)
                java.lang.String r1 = r7.f1841a
                int r3 = r7.f1842b
                r5 = 4
                r6 = 0
                r4 = 0
                r2 = r8
                boolean r8 = p027d5.q.H(r1, r2, r3, r4, r5, r6)
                if (r8 == 0) goto L1d
                int r8 = r7.f1842b
                int r0 = r2.length()
                int r8 = r8 + r0
                r7.f1842b = r8
                return
            L1d:
                r7.a()
                u3.e r7 = new u3.e
                r7.<init>()
                throw r7
        }

        public final void c() {
                r2 = this;
                r2.f()
                r0 = 0
                r2.e(r0)
                r2.f()
                int r0 = r2.f1842b
                java.lang.String r1 = r2.f1841a
                int r1 = r1.length()
                if (r0 != r1) goto L15
                return
            L15:
                r2.a()
                u3.e r2 = new u3.e
                r2.<init>()
                throw r2
        }

        public final java.lang.String d() {
                r6 = this;
                int r0 = r6.f1842b
                java.lang.String r1 = r6.f1841a
                int r1 = r1.length()
                if (r0 >= r1) goto L14a
                java.lang.String r0 = r6.f1841a
                int r1 = r6.f1842b
                int r2 = r1 + 1
                r6.f1842b = r2
                char r0 = r0.charAt(r1)
                r1 = 34
                if (r0 != r1) goto L14a
                java.lang.StringBuilder r0 = new java.lang.StringBuilder
                r0.<init>()
            L1f:
                int r2 = r6.f1842b
                java.lang.String r3 = r6.f1841a
                int r3 = r3.length()
                if (r2 >= r3) goto L141
                java.lang.String r2 = r6.f1841a
                int r3 = r6.f1842b
                int r4 = r3 + 1
                r6.f1842b = r4
                char r2 = r2.charAt(r3)
                if (r2 != r1) goto L86
                java.lang.String r0 = r0.toString()
                java.lang.String r1 = "toString(...)"
                J3.l.e(r0, r1)
                r1 = 0
            L41:
                int r2 = r0.length()
                if (r1 >= r2) goto L85
                char r2 = r0.charAt(r1)
                boolean r2 = java.lang.Character.isHighSurrogate(r2)
                if (r2 == 0) goto L6f
                int r2 = r1 + 1
                int r3 = r0.length()
                if (r2 >= r3) goto L66
                char r2 = r0.charAt(r2)
                boolean r2 = java.lang.Character.isLowSurrogate(r2)
                if (r2 == 0) goto L66
                int r1 = r1 + 2
                goto L41
            L66:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L6f:
                char r2 = r0.charAt(r1)
                boolean r2 = java.lang.Character.isLowSurrogate(r2)
                if (r2 != 0) goto L7c
                int r1 = r1 + 1
                goto L41
            L7c:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L85:
                return r0
            L86:
                r3 = 32
                int r3 = J3.l.g(r2, r3)
                if (r3 < 0) goto L138
                r3 = 92
                if (r2 == r3) goto L96
                r0.append(r2)
                goto L1f
            L96:
                int r2 = r6.f1842b
                java.lang.String r4 = r6.f1841a
                int r4 = r4.length()
                if (r2 >= r4) goto L12f
                java.lang.String r2 = r6.f1841a
                int r4 = r6.f1842b
                int r5 = r4 + 1
                r6.f1842b = r5
                char r2 = r2.charAt(r4)
                if (r2 == r1) goto L11e
                r4 = 47
                if (r2 == r4) goto L11e
                if (r2 == r3) goto L11e
                r3 = 98
                if (r2 == r3) goto L12c
                r3 = 102(0x66, float:1.43E-43)
                if (r2 == r3) goto L129
                r3 = 110(0x6e, float:1.54E-43)
                if (r2 == r3) goto L126
                r3 = 114(0x72, float:1.6E-43)
                if (r2 == r3) goto L123
                r3 = 116(0x74, float:1.63E-43)
                if (r2 == r3) goto L11c
                r3 = 117(0x75, float:1.64E-43)
                if (r2 != r3) goto L113
                int r2 = r6.f1842b
                int r2 = r2 + 4
                java.lang.String r3 = r6.f1841a
                int r3 = r3.length()
                if (r2 > r3) goto L10a
                java.lang.String r2 = r6.f1841a
                int r3 = r6.f1842b
                int r4 = r3 + 4
                java.lang.String r2 = r2.substring(r3, r4)
                java.lang.String r3 = "substring(...)"
                J3.l.e(r2, r3)
                r3 = 16
                java.lang.Integer r2 = p027d5.q.o(r2, r3)
                if (r2 == 0) goto L101
                int r2 = r2.intValue()
                char r2 = (char) r2
                r0.append(r2)
                int r2 = r6.f1842b
                int r2 = r2 + 4
                r6.f1842b = r2
                u3.A r2 = p137u3.A.f16167a
                goto L1f
            L101:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L10a:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L113:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L11c:
                r2 = 9
            L11e:
                r0.append(r2)
                goto L1f
            L123:
                r2 = 13
                goto L11e
            L126:
                r2 = 10
                goto L11e
            L129:
                r2 = 12
                goto L11e
            L12c:
                r2 = 8
                goto L11e
            L12f:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L138:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L141:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L14a:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
        }

        public final void e(int r7) {
                r6 = this;
                r6.f()
                r0 = 32
                if (r7 > r0) goto L188
                int r0 = r6.f1843c
                int r0 = r0 + 1
                r6.f1843c = r0
                r1 = 500000(0x7a120, float:7.00649E-40)
                if (r0 > r1) goto L188
                int r0 = r6.f1842b
                java.lang.String r1 = r6.f1841a
                int r1 = r1.length()
                if (r0 >= r1) goto L188
                java.lang.String r0 = r6.f1841a
                int r1 = r6.f1842b
                char r0 = r0.charAt(r1)
                r1 = 34
                if (r0 == r1) goto L184
                r1 = 91
                r2 = 44
                if (r0 == r1) goto L128
                r1 = 102(0x66, float:1.43E-43)
                if (r0 == r1) goto L122
                r1 = 110(0x6e, float:1.54E-43)
                if (r0 == r1) goto L11c
                r1 = 116(0x74, float:1.63E-43)
                if (r0 == r1) goto L116
                r1 = 123(0x7b, float:1.72E-43)
                if (r0 == r1) goto L7a
                d5.o r7 = new d5.o
                java.lang.String r0 = "-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?"
                r7.<init>(r0)
                java.lang.String r0 = r6.f1841a
                int r1 = r6.f1842b
                d5.l r7 = r7.b(r0, r1)
                if (r7 == 0) goto L71
                P3.c r0 = r7.c()
                int r0 = r0.d()
                int r1 = r6.f1842b
                if (r0 != r1) goto L68
                P3.c r7 = r7.c()
                int r7 = r7.f()
                int r7 = r7 + 1
                r6.f1842b = r7
                return
            L68:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L71:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L7a:
                int r0 = r6.f1842b
                int r0 = r0 + 1
                r6.f1842b = r0
                r6.f()
                java.util.HashSet r0 = new java.util.HashSet
                r0.<init>()
                int r1 = r6.f1842b
                java.lang.String r3 = r6.f1841a
                int r3 = r3.length()
                r4 = 125(0x7d, float:1.75E-43)
                if (r1 >= r3) goto La5
                java.lang.String r1 = r6.f1841a
                int r3 = r6.f1842b
                char r1 = r1.charAt(r3)
                if (r1 != r4) goto La5
                int r7 = r6.f1842b
                int r7 = r7 + 1
                r6.f1842b = r7
                return
            La5:
                r6.f()
                java.lang.String r1 = r6.d()
                boolean r1 = r0.add(r1)
                if (r1 == 0) goto L10d
                r6.f()
                int r1 = r6.f1842b
                java.lang.String r3 = r6.f1841a
                int r3 = r3.length()
                if (r1 >= r3) goto L104
                java.lang.String r1 = r6.f1841a
                int r3 = r6.f1842b
                int r5 = r3 + 1
                r6.f1842b = r5
                char r1 = r1.charAt(r3)
                r3 = 58
                if (r1 != r3) goto L104
                int r1 = r7 + 1
                r6.e(r1)
                r6.f()
                int r1 = r6.f1842b
                java.lang.String r3 = r6.f1841a
                int r3 = r3.length()
                if (r1 >= r3) goto Lfb
                java.lang.String r1 = r6.f1841a
                int r3 = r6.f1842b
                int r5 = r3 + 1
                r6.f1842b = r5
                char r1 = r1.charAt(r3)
                if (r1 == r4) goto L17a
                if (r1 != r2) goto Lf2
                goto La5
            Lf2:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            Lfb:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L104:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L10d:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L116:
                java.lang.String r7 = "true"
                r6.b(r7)
                return
            L11c:
                java.lang.String r7 = "null"
                r6.b(r7)
                return
            L122:
                java.lang.String r7 = "false"
                r6.b(r7)
                return
            L128:
                int r0 = r6.f1842b
                int r0 = r0 + 1
                r6.f1842b = r0
                r6.f()
                int r0 = r6.f1842b
                java.lang.String r1 = r6.f1841a
                int r1 = r1.length()
                r3 = 93
                if (r0 >= r1) goto L14e
                java.lang.String r0 = r6.f1841a
                int r1 = r6.f1842b
                char r0 = r0.charAt(r1)
                if (r0 != r3) goto L14e
                int r7 = r6.f1842b
                int r7 = r7 + 1
                r6.f1842b = r7
                return
            L14e:
                int r0 = r7 + 1
                r6.e(r0)
                r6.f()
                int r0 = r6.f1842b
                java.lang.String r1 = r6.f1841a
                int r1 = r1.length()
                if (r0 >= r1) goto L17b
                java.lang.String r0 = r6.f1841a
                int r1 = r6.f1842b
                int r4 = r1 + 1
                r6.f1842b = r4
                char r0 = r0.charAt(r1)
                if (r0 == r3) goto L17a
                if (r0 != r2) goto L171
                goto L14e
            L171:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L17a:
                return
            L17b:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
            L184:
                r6.d()
                return
            L188:
                r6.a()
                u3.e r6 = new u3.e
                r6.<init>()
                throw r6
        }

        public final void f() {
                r5 = this;
            L0:
                int r0 = r5.f1842b
                java.lang.String r1 = r5.f1841a
                int r1 = r1.length()
                if (r0 >= r1) goto L24
                java.lang.String r0 = r5.f1841a
                int r1 = r5.f1842b
                char r0 = r0.charAt(r1)
                r1 = 2
                r2 = 0
                java.lang.String r3 = " \r\n\t"
                r4 = 0
                boolean r0 = p027d5.q.N(r3, r0, r4, r1, r2)
                if (r0 == 0) goto L24
                int r0 = r5.f1842b
                int r0 = r0 + 1
                r5.f1842b = r0
                goto L0
            L24:
                return
        }
    }

    static {
            L5.n r0 = new L5.n
            r0.<init>()
            L5.n.f1840a = r0
            return
    }

    private n() {
            r0 = this;
            r0.<init>()
            return
    }

    public final void a(java.lang.String r1) {
            r0 = this;
            java.lang.String r0 = "source"
            J3.l.f(r1, r0)
            L5.n$a r0 = new L5.n$a
            r0.<init>(r1)
            r0.c()
            return
    }
}
