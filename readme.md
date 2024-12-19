# Docker-compose Nedir? Nasıl kullanılır?

Docker Compose, birden fazla servisten (örneğin: backend, frontend ve veritabanı) oluşan uygulamaları tek bir dosyadan kolayca yapılandırıp çalıştırmanızı sağlayan güçlü bir araçtır. En büyük avantajı, tüm uygulama bileşenlerini yalnızca bir **`docker-compose.yml`** dosyası ile tanımlayabilmenizdir. Bu sayede bileşenlerin başlatılması, yönetilmesi ve durdurulması son derece kolay hale gelir.

Sadece uzun ve karmaşık `docker run` komutları yazmaktan kurtulurken, aynı zamanda bu yapılandırma dosyasını paylaşarak geliştirme ve dağıtım ortamlarında benzer sonuçlar elde edebilirsiniz.

### Docker Compose'un Temel Özellikleri

1. **Birden Çok Servisi Yönetebilirsiniz**  
    Bir uygulamanın tüm servislerini (örneğin: veritabanı, API, cache) tek bir yapılandırma dosyasında tanımlayıp çalıştırabilirsiniz.
    
2. **Yapılandırmayı Kod Şeklinde Yazabilirsiniz**  
    Servislerin yapılandırmalarını bir YAML dosyasında (`docker-compose.yml`) yazarak kod haline getirebilirsiniz. Bu, paylaşımı ve yeniden kullanımını kolaylaştırır.
    
3. **Tek Komutla Çalıştırma**  
    `docker-compose up` komutuyla tüm servislere ait konteynerleri aynı anda başlatabilirsiniz.
    
4. **Ortamlar Arası Uyumluluk**  
    Geliştirme, test ve üretim ortamları arasında kolay geçiş sağlar.

### Docker Compose Nasıl Kullanılır

#### Kurulum
Docker Compose, genellikle **Docker Desktop** ile birlikte gelir. Bu yüzden kullanabilmek için öncelikle makinenizde Docker Desktop'un kurulu olduğundan emin olmanız gerekir.

- **Docker Desktop Kurulumu**  
    Eğer Docker Desktop kurulu değilse, Docker'ın resmi web sitesi üzerinden indirip kurabilirsiniz.
    
- **Linux Kullanıcıları İçin**  
    Herhangi bir Linux dağıtımı kullanıyorsanız, paket yöneticinizi kullanarak Docker ve Docker Compose'u kolayca kurabilirsiniz.
#### Örnek Kullanım

**Docker Compose ile Next.js Uygulaması Kurulumu**

Bu proje, PostgreSQL veritabanı ve Nginx ters proxy'si ile bir Next.js uygulaması için Docker Compose kurulumudur. Her dosyayı ve amacını inceleyelim:

**1. `docker-compose.yml`**

Bu dosya, uygulamayı oluşturan farklı hizmetleri koordine eder. Docker Compose sürüm 3.8 kullanır.
```
version: '3.8'
services:
  nextjs:
    build:
      context: ./app
    ports:
      - "3000:3000"
    volumes:
      - ./app:/app
    environment:
      DATABASE_URL: postgres://user:password@postgres:5432/mydb
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

  nginx:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - nextjs

volumes:
  pgdata:
```
- **`services`**: Farklı konteynerleri tanımlar.
    - **`nextjs`**: Next.js uygulaması.
        - `build`: Dockerfile'ın bulunduğu `./app` dizinini belirtir.
        - `ports`: Hosttaki 3000 portunu konteynerdeki 3000 portuna eşler.
        - `volumes`: Hosttaki `./app` dizinini konteynerdeki `/app` dizinine bağlar. Bu, geliştirme sırasında canlı kod reload edebilmemizi sağlar.
        - `environment`: Next.js uygulamasının PostgreSQL veritabanına bağlanmak için kullandığı `DATABASE_URL` ortam değişkenini ayarlar. `postgres` hostname'ı, PostgreSQL konteynerinin hizmet adını ifade eder ve Docker'ın iç ağ iletişimini yönetmesine izin verir.
        - `depends_on`: `postgres` konteynerinin `nextjs` konteynerinden önce başlatılmasını sağlar.
    - **`postgres`**: PostgreSQL veritabanı.
        - `image`: Resmi `postgres:14` Docker imajını kullanır.
        - `ports`: Hosttaki 5432 portunu konteynerdeki 5432 portuna eşler.
        - `environment`: PostgreSQL kullanıcı adı, şifre ve veritabanı adını ayarlar.
        - `volumes`: Veritabanı verilerini konteyner yeniden başlatmalarında kalıcı hale getirmek için `pgdata` adlı bir adlandırılmış volume oluşturur. Bu, veri kaybını önlemek için çok önemlidir.
    - **`nginx`**: Nginx ters proxy.
        - `image`: Resmi `nginx:latest` Docker imajını kullanır.
        - `ports`: Hosttaki 8080 portunu konteynerdeki 80 portuna eşler. Bu, uygulamanıza `http://localhost:8080` üzerinden erişeceğiniz anlamına gelir.
        - `volumes`: Özel bir Nginx yapılandırma dosyası (`./nginx/default.conf`) konteyner içine bağlar. Bu dosya, Nginx'in gelen requestleri nasıl işleyeceğini ve Next.js uygulamasına nasıl yönlendireceğini tanımlar.
        - `depends_on`: `nextjs` konteynerinin `nginx` konteynerinden önce başlatılmasını sağlar.
- **`volumes`**: PostgreSQL veri kalıcılığı için kullanılan `pgdata` adlı adlandırılmış volume'u tanımlar.

**2. `Dockerfile` (./app içinde)**

Bu dosya, Next.js uygulamasının Docker imajının nasıl oluşturulduğunu tanımlar.
```
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client during build
RUN npx prisma generate

# Expose the app port
EXPOSE 3000

# Command to run migrations and seed, then start the development server
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && npm run dev"]
```
- `FROM node:18`: Node.js 18 temel imajını kullanır.
- `WORKDIR /app`: Konteyner içinde çalışma dizinini ayarlar.
- `COPY package.json package-lock.json ./`: Paket dosyalarını önce kopyalar. Bu, Docker'ın önbellekleme mekanizması için önemlidir. Bu dosyalar değişmediyse, Docker önceki derlemeden önbelleğe alınmış katmanı yeniden kullanabilir ve sonraki derlemeleri önemli ölçüde hızlandırabilir.
- `RUN npm install`: Node.js bağımlılıklarını yükler.
- `COPY . .`: Uygulamanın geri kalanını kopyalar.
- `RUN npx prisma generate`: Prisma istemcisini oluşturur. Bu, veritabanıyla etkileşim kurmak için gereklidir.
- `EXPOSE 3000`: Konteynerden 3000 portunu açar.
- `CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && npm run dev"]`: Konteyner başlatıldığında çalıştırılan komutu tanımlar. Bu komut, veritabanı geçişlerini gerçekleştirir, veritabanını tohumlar (bir tohumlama betiğiniz varsa) ve ardından Next.js geliştirme sunucusunu başlatır.

**3. `nginx/default.conf`**

Bu dosya, Nginx yapılandırmasını içerir.
```
server {

listen 80;

  

location / {

proxy_pass http://nextjs:3000;

proxy_http_version 1.1;

proxy_set_header Upgrade $http_upgrade;

proxy_set_header Connection 'upgrade';

proxy_set_header Host $host;

proxy_cache_bypass $http_upgrade;

}

}
```
- **`listen 80;`**: Sunucunun 80 numaralı portta dinleyeceğini belirtir. Yani, sunucuya gelen tüm HTTP trafiği bu port üzerinden yönetilecektir.
- **`location / { ... }`**: Tüm istekler (/) için bu bloğun içindeki kurallar geçerlidir.
- **`proxy_pass http://nextjs:3000;`**: Gelen tüm istekler `nextjs` adlı bir servisin 3000 numaralı portuna yönlendirilir. Bu sayede, Nginx, istekleri doğrudan Next.js uygulamasına iletir.
- **`proxy_http_version 1.1;`**: Proxy bağlantısı için kullanılan HTTP sürümünü 1.1 olarak belirtir.
- **`proxy_set_header Upgrade $http_upgrade;`**: İstemciden gelen `Upgrade` başlığını, proxy edilen sunucuya (Next.js) aktarır. Bu, WebSocket bağlantıları için çok önemlidir. WebSocket bağlantıları, normal HTTP bağlantıları gibi değil, bir kez kurulduktan sonra sürekli açık kalır ve çift yönlü iletişime izin verir. `Upgrade` başlığı, sunucunun bağlantıyı WebSocket protokolüne yükseltmesine olanak tanır.
- **`proxy_set_header Connection 'upgrade';`**: Proxy isteğinde `Connection` başlığını `upgrade` olarak ayarlar. Bu da WebSocket bağlantıları için gereklidir.
- **`proxy_set_header Host $host;`**: İstemciden gelen `Host` başlığını, proxy edilen sunucuya aktarır. Bu, doğru sunucu tanımlaması ve yönlendirme için önemlidir.
- **`proxy_cache_bypass $http_upgrade;`**: `Upgrade` başlığı olan isteklerin önbelleğe alınmasını engeller. WebSocket bağlantıları dinamiktir ve önbelleğe alınamaz, bu nedenle bu direktif bu durum için gereklidir.

### Sonuç

Docker Compose, Docker ekosisteminde çok önemli bir yere sahiptir. Bu araç sayesinde, uygulama geliştirme süreçleri daha hızlı, daha güvenilir ve daha esnek hale gelir. Eğer henüz Docker Compose kullanmıyorsanız, mutlaka denemelisiniz.

**Daha fazla bilgi için Docker Compose dokümantasyonunu inceleyebilirsiniz:** 
**https://docs.docker.com/compose/**