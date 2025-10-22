# CONFIGURACIÓN DOMINIO TRACK-PORT.COM
## Instrucciones para conectar www.track-port.com

### 🎯 ESTADO ACTUAL
✅ **GitHub Pages configurado** con archivo CNAME  
✅ **Usuarios corregidos** usando @track-port.com  
✅ **Sistema funcionando** en: https://eniembro.github.io/trackport  
⏳ **Pendiente**: Configurar DNS del dominio track-port.com

---

## 📋 PASOS PARA ACTIVAR EL DOMINIO

### 1️⃣ **REGISTRAR EL DOMINIO** (Si no lo tienes)
- Ve a **GoDaddy**, **Namecheap**, o **Cloudflare**
- Busca y compra: `track-port.com`
- Costo aproximado: $10-15 USD/año

### 2️⃣ **CONFIGURAR DNS** (En tu proveedor de dominio)

**Opción A - GitHub Pages (Recomendado):**
```
Tipo: A
Nombre: @
Valor: 185.199.108.153

Tipo: A  
Nombre: @
Valor: 185.199.109.153

Tipo: A
Nombre: @  
Valor: 185.199.110.153

Tipo: A
Nombre: @
Valor: 185.199.111.153

Tipo: CNAME
Nombre: www
Valor: eniembro.github.io
```

**Opción B - Vercel (Alternativa):**
```
Tipo: A
Nombre: @  
Valor: 76.76.19.19

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
```

### 3️⃣ **VERIFICAR CONFIGURACIÓN**
Una vez configurado el DNS (puede tardar 24-48 horas):

```bash
# Verificar resolución DNS
nslookup track-port.com
nslookup www.track-port.com

# Probar acceso
curl -I https://www.track-port.com
curl -I https://track-port.com
```

### 4️⃣ **ACTIVAR HTTPS**
En GitHub Pages:
1. Ve a: Settings > Pages
2. Verifica que Custom domain sea: `track-port.com`
3. ✅ Enforce HTTPS

---

## 🔑 USUARIOS ACTUALIZADOS (Dominio Correcto)

**Administradores:**
- `admin@track-port.com` / 123456 (main_admin)
- `fanny@track-port.com` / 123456 (main_admin)
- `lrazo@track-port.com` / 123456 (main_admin)

**Servicio al Cliente:**
- `sac1@track-port.com` / 123456 (customer_service)
- `sac2@track-port.com` / 123456 (customer_service)

**Ventas:**
- `ventas1@track-port.com` / 123456 (sales)
- `ventas2@track-port.com` / 123456 (sales)

**Aduanas:**
- `aduana_lzo@track-port.com` / 123456 (customs_broker)

**Cliente Demo:**
- `cliente@track-port.com` / 123456 (client)

---

## 🚀 ESTADO DEL SISTEMA

✅ **Funcionando ahora en:** https://eniembro.github.io/trackport  
✅ **Logo profesional** implementado  
✅ **GitHub Copilot** integrado  
✅ **Todos los módulos** funcionando  
✅ **9 usuarios reales** configurados  
✅ **Redirección automática** a dominio personalizado  

**🎯 Próximo paso:** Configurar DNS en tu proveedor de dominios

---

## ⚡ ACCESO INMEDIATO

**Mientras configuras el dominio, el sistema está 100% funcional en:**
https://eniembro.github.io/trackport

**Una vez configurado el DNS, estará disponible en:**
- https://www.track-port.com
- https://track-port.com

**¿Necesitas ayuda configurando el DNS en tu proveedor específico? ¡Avísame cuál usas!**