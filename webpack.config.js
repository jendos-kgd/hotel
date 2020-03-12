// Подключаем доп. модули для webpack
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

//Определяем сборку: разработка или продакшн
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

//Оптимизация в зависимости от того, какая сборка: разработка или продакшн
const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

//Функция, которая меняет имена файлов сборки в зависимости от разработка/продакшн
const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

module.exports = {
  context: path.resolve(__dirname, 'src'),  //откуда берем файлы для сборки
  entry: {
    main: './index.js' //основной файл js
  },
  output: {
    filename: filename('js'), // окончательный файл js
    path: path.resolve(__dirname, 'dist') //куда отправляем файл после сборки
  },
  resolve: {
    extensions: ['.js'], //Какие расширения понимать, когда они не указаны
    alias: {
      '@': path.resolve(__dirname, 'src') //Сокращение написания пути к файлам и папкам
    }
  },
  optimization: optimization(), //Применяем функцию оптимизации optimization()
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.pug', //входной файл html(pug) (в папке /src)
      minify: {
        collapseWhitespace: isProd  //Сжимаем html в продакшн
      }
    }),
    new CleanWebpackPlugin(), //удаляем старые файлы при сборке
    new MiniCssExtractPlugin({ //создаем отдельный css в dist
      filename: filename('css') //выходной файл css
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/, // что делать с pug файлами
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // Создает стили из строк JS
          MiniCssExtractPlugin.loader,
          // Переводит CSS в JS
          'css-loader',
          // Компилирует Sass в CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/, // что использовать для css
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/, // что делать с картинками
        loader: 'file-loader',
        options: {
          outputPath: 'src/images'
        }
      },
      {
        test: /\.(ttf|svg|woff)$/, // что делать со шрифтами
        loader: 'file-loader',
        options: {
          outputPath: 'src/fonts'
        }
      }
    ]
  }
}
