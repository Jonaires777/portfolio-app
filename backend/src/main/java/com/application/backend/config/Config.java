package com.application.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.application.backend.model.Fornecedor;
import com.application.backend.repositories.FornecedorRepository;
import com.github.javafaker.Faker;

@Configuration
public class Config implements CommandLineRunner {

        @Autowired
        private FornecedorRepository fornecedorRepository;

        @Override
        public void run(String... args) throws Exception {

                if (fornecedorRepository.count() > 0) {
                        return;
                }

                Faker faker = new Faker();
                SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");

                for (int i = 0; i < 1000; i++) {
                        String name = String.valueOf(faker.name().name());
                        String celular = String.valueOf(faker.numerify("(##)9####-####"));
                        String cnpjCString = String.valueOf(faker.numerify("###.###.###-##"));
                        String produtos = String.valueOf(faker.commerce().department());
                        String email = String.valueOf(faker.numerify("###exe####mplo######@exemplo.com"));
                        String endereco = String.valueOf(faker.address().city() + " " + "" + faker.address().state());
                        String date = sdf.format(new Date());

                        Fornecedor fornecedor = Fornecedor.builder().celular(celular).cnpjCpf(cnpjCString)
                                        .dataCadastro(date).email(email)
                                        .endereco(endereco).nome(name).nomeRepresentante(name)
                                        .produtosServicos(produtos).build();

                        fornecedorRepository.save(fornecedor);
                }

        }

}
