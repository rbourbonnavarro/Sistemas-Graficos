class Material {

    constructor() {
        this.kd;
        this.ka;
        this.ks;
        this.shininess;
        this.diffuseMap;
        this.diffuseMapIntensity;
        this.normalMap;
        this.cubemap;

        program.u_use_diffuse_texture = gl.getUniformLocation(program, "uMaterial.useDiffuseTexture");
        program.u_use_normal_texture = gl.getUniformLocation(program, "uMaterial.useNormalTexture");
        program.u_use_reflection = gl.getUniformLocation(program, "uMaterial.useReflection");

        program.u_texture_diffuse = gl.getUniformLocation(program, "uMaterial.texDiffuse");
        program.u_texture_normal = gl.getUniformLocation(program, "uMaterial.texNormal");
        program.u_cube_map = gl.getUniformLocation(program, "uMaterial.cubemap");

        program.u_diffuse_map_intensity = gl.getUniformLocation(program, "uMaterial.diffuseMapIntensity");

        program.u_kd = gl.getUniformLocation(program, "uMaterial.kd");
        program.u_ka = gl.getUniformLocation(program, "uMaterial.ka");
        program.u_ks = gl.getUniformLocation(program, "uMaterial.ks");
        program.u_shininess_val = gl.getUniformLocation(program, "uMaterial.shininess");

    }

    setColor(kd) {
        this.kd = kd;
        this.ka = vec3.create();
        vec3.scale(this.ka, this.kd, 1/3);
    }

    setSpecular(ks) {
        this.ks = ks;
        this.setShininess(10);
    }

    setShininess(shininess) {
        this.shininess = shininess * shininess;
    }

    setDiffuseMap(diffuseMap) {
        this.diffuseMap = diffuseMap;
        this.setDiffuseMapIntensity(1);
        this.ka = [0.1, 0.1, 0.1];
    }

    setDiffuseMapIntensity(diffuseMapIntensity) {
        this.diffuseMapIntensity = diffuseMapIntensity;
    }

    setNormalMap(normalMap) {
        this.normalMap = normalMap;
    }

    setCubemap(cubemap) {
        this.cubemap = cubemap;
        this.ka = [0.1, 0.1, 0.1];
    }

    setup() {
        
        gl.uniform1i(program.u_use_diffuse_texture, false);
        gl.uniform1i(program.u_use_normal_texture, false);
        gl.uniform1i(program.u_use_reflection, false);
        gl.uniform3fv(program.u_ks, [0, 0, 0]);
        gl.uniform1f(program.u_diffuse_map_intensity, 0);
        
        gl.uniform3fv(program.u_kd, this.kd);
        gl.uniform3fv(program.u_ka, this.ka);
        
        if(this.ks) {
            gl.uniform3fv(program.u_ks, this.ks);
            gl.uniform1f(program.u_shininess_val, this.shininess);
        }

        if(this.diffuseMap) {
            gl.uniform1i(program.u_use_diffuse_texture, true);
            gl.uniform1f(program.u_diffuse_map_intensity, this.diffuseMapIntensity);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.diffuseMap);
            gl.uniform1i(program.u_texture_diffuse, 0);
        }
        
        if(this.normalMap) {
            gl.uniform1i(program.u_use_normal_texture, true);
            
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.normalMap);
            gl.uniform1i(program.u_texture_normal, 1);
        }

        if(this.cubemap) {
            gl.uniform1i(program.u_use_reflection, true);
            
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemap);
            gl.uniform1i(program.u_cube_map, 2);
        }

    }

}
